import { CONTAINER_ORDER } from '@/constants/containerSpecs';
import type {
  AdviceItem,
  BoxOrientation,
  CalculationOptions,
  CargoInput,
  CargoItemInput,
  ContainerCalculationResult,
  ContainerSpec,
  DoorCheckInfo,
  LoadCalculationSummary,
  RiskLevel,
  SkuBreakdownItem,
  SplitPlanSuggestion,
  WeightDistributionPlan,
} from '@/types/loadCalculator';
import { clamp, safeDivide } from '@/utils/math';
import { getBestOrientation, getBoxOrientations } from '@/utils/packing';

export function calcSingleBoxVolumeM3(lengthCm: number, widthCm: number, heightCm: number) {
  return (lengthCm * widthCm * heightCm) / 1_000_000;
}

export function calcTotalCargoVolumeM3(cargo: Pick<CargoInput, 'lengthCm' | 'widthCm' | 'heightCm' | 'quantity'>) {
  return calcSingleBoxVolumeM3(cargo.lengthCm, cargo.widthCm, cargo.heightCm) * cargo.quantity;
}

export function calcTotalCargoWeightKg(cargo: Pick<CargoInput, 'weightKg' | 'quantity'>) {
  return cargo.weightKg * cargo.quantity;
}

export function createDefaultOptions(): CalculationOptions {
  return {
    loadingProfile: 'balanced',
    reserveDoorSpaceCm: 15,
    reserveTopSpaceCm: 5,
    reserveWeightBufferRate: 0.05,
    scenario: 'general',
    loadDirection: 'balanced',
    enforceDoorCheck: true,
    floorWeightAlertKg: 80,
  };
}

function normalizeOptions(options?: Partial<CalculationOptions>): CalculationOptions {
  return {
    ...createDefaultOptions(),
    ...options,
  };
}

function getProfileFactor(profile: CalculationOptions['loadingProfile']) {
  if (profile === 'conservative') return 0.92;
  if (profile === 'aggressive') return 1;
  return 0.96;
}

function getScenarioFactor(scenario: CalculationOptions['scenario']) {
  if (scenario === 'fba') return 0.94;
  if (scenario === 'fragile') return 0.9;
  return 1;
}

function createEffectiveContainer(container: ContainerSpec, options: CalculationOptions): ContainerSpec {
  const profileFactor = getProfileFactor(options.loadingProfile);
  const scenarioFactor = getScenarioFactor(options.scenario);
  const volumeFactor = clamp(profileFactor * scenarioFactor, 0.82, 1);

  const effectiveLength = Math.max(1, container.innerLengthCm - options.reserveDoorSpaceCm);
  const effectiveHeight = Math.max(1, container.innerHeightCm - options.reserveTopSpaceCm);
  const effectiveWeight = Math.max(1, container.maxPayloadKg * (1 - options.reserveWeightBufferRate));
  const effectiveVolume = container.volumeM3 * volumeFactor;

  return {
    ...container,
    innerLengthCm: effectiveLength,
    innerHeightCm: effectiveHeight,
    volumeM3: effectiveVolume,
    maxPayloadKg: effectiveWeight,
  };
}

function pickRepresentativeItem(items: CargoItemInput[]) {
  return [...items].sort((a, b) => {
    const aVolume = calcTotalCargoVolumeM3(a);
    const bVolume = calcTotalCargoVolumeM3(b);
    if (bVolume !== aVolume) return bVolume - aVolume;
    return b.quantity - a.quantity;
  })[0];
}

function exceedsContainerInEveryOrientation(cargo: CargoInput, container: ContainerSpec) {
  const orientations = getBoxOrientations(cargo);
  return orientations.every((o) => (
    o.lengthCm > container.innerLengthCm ||
    o.widthCm > container.innerWidthCm ||
    o.heightCm > container.innerHeightCm
  ));
}

function getScenarioLabel(scenario: CalculationOptions['scenario']) {
  return {
    general: '通用出货',
    fba: 'FBA 场景',
    traditional: '传统外贸',
    fragile: '易碎货',
  }[scenario];
}

function getDirectionLabel(direction: CalculationOptions['loadDirection']) {
  return {
    'tail-first': '尾门优先',
    balanced: '前后均衡',
    'heavy-front': '重货靠前',
  }[direction];
}

function evaluateDoorCheck(orientations: BoxOrientation[], container: ContainerSpec, checked: boolean): DoorCheckInfo {
  if (!checked) {
    return {
      checked: false,
      canPassDoor: true,
      passOrientations: orientations.map((item) => item.label),
      blockedOrientations: [],
    };
  }

  const passOrientations = orientations
    .filter((orientation) => {
      const pairA = orientation.widthCm <= container.doorWidthCm && orientation.heightCm <= container.doorHeightCm;
      const pairB = orientation.heightCm <= container.doorWidthCm && orientation.widthCm <= container.doorHeightCm;
      return pairA || pairB;
    })
    .map((item) => item.label);

  const blockedOrientations = orientations
    .filter((item) => !passOrientations.includes(item.label))
    .map((item) => item.label);

  return {
    checked: true,
    canPassDoor: passOrientations.length > 0,
    passOrientations,
    blockedOrientations,
  };
}

function createSplitPlan(container: ContainerSpec, maxFitByCount: number, totalVolume: number, totalWeight: number, quantity: number): SplitPlanSuggestion {
  const byVolume = Math.max(1, Math.ceil(totalVolume / container.volumeM3));
  const byWeight = Math.max(1, Math.ceil(totalWeight / container.maxPayloadKg));
  const byCount = maxFitByCount > 0 ? Math.max(1, Math.ceil(quantity / maxFitByCount)) : 99;
  const sameContainerCount = Math.max(byVolume, byWeight, byCount);

  const lines = [
    `按当前 ${container.name} 测算，至少需要 ${sameContainerCount} 柜同规格柜。`,
    `拆分依据：体积 ${byVolume} 柜 / 重量 ${byWeight} 柜 / 件数 ${byCount} 柜。`,
  ];

  if (sameContainerCount >= 2) {
    lines.push('可优先考虑主柜 + 补柜的拆分方式，先把重货和超大件单独拎出来。');
  }

  return {
    sameContainerCount,
    sameContainerLabel: `${sameContainerCount} × ${container.code}`,
    byVolume,
    byWeight,
    byCount,
    lines,
  };
}

function createOperationChecklist(options: CalculationOptions, hasFragile: boolean, doorChecked: boolean) {
  const list = [
    `装柜前复核箱规、毛重、箱唛与 ${getScenarioLabel(options.scenario)} 的包装要求。`,
    `按 ${getDirectionLabel(options.loadDirection)} 策略安排堆码顺序，先规划靠前、居中、门口区域。`,
    `现场保留门口 ${options.reserveDoorSpaceCm} cm、顶部 ${options.reserveTopSpaceCm} cm 的操作余量。`,
    `按 ${Math.round(options.reserveWeightBufferRate * 100)}% 的重量缓冲复核提单毛重与装柜计划。`,
  ];

  if (doorChecked) {
    list.push('装柜前再次确认最大外箱能否通过柜门净宽 / 净高，避免现场卡门。');
  }
  if (hasFragile) {
    list.push('包含易碎件，建议增加角护、隔板或防压标识，并降低上层堆压。');
  }
  if (options.scenario === 'fba') {
    list.push('FBA 场景建议同步复核打板、标签、预约与仓库拒收风险。');
  }
  return list;
}

function createWeightDistribution(totalWeight: number, options: CalculationOptions): WeightDistributionPlan {
  if (options.loadDirection === 'heavy-front') {
    return {
      strategy: options.loadDirection,
      frontRatio: 0.6,
      rearRatio: 0.4,
      note: `总重约 ${totalWeight.toFixed(0)} kg，建议重货更多落在前半柜，门口区域避免过度集中。`,
    };
  }
  if (options.loadDirection === 'tail-first') {
    return {
      strategy: options.loadDirection,
      frontRatio: 0.45,
      rearRatio: 0.55,
      note: `总重约 ${totalWeight.toFixed(0)} kg，门口优先装方案更便于尾部先装，但仍需避免尾部偏载。`,
    };
  }
  return {
    strategy: options.loadDirection,
    frontRatio: 0.5,
    rearRatio: 0.5,
    note: `总重约 ${totalWeight.toFixed(0)} kg，建议前后均衡分布，降低偏载与运输晃动风险。`,
  };
}

function buildCommonAdvice(result: {
  canFit: boolean;
  volumeUsageRate: number;
  weightUsageRate: number;
  unplacedQuantity: number;
  containerName: string;
  scenario: CalculationOptions['scenario'];
  splitPlan?: SplitPlanSuggestion;
  doorCheck?: DoorCheckInfo;
}): AdviceItem[] {
  const list: AdviceItem[] = [];

  if (result.canFit) {
    list.push({
      level: 'success',
      title: `优先建议 ${result.containerName}`,
      description: `按当前参数测算，该柜型可以承载本票货物，适合作为 ${getScenarioLabel(result.scenario)} 的首选方案。`,
    });
  }

  if (result.doorCheck?.checked && !result.doorCheck.canPassDoor) {
    list.push({
      level: 'warning',
      title: '柜门通过性不足',
      description: '虽然柜内容积可能满足，但当前箱规可能无法顺利通过柜门，建议先改包装或换装载方向。',
    });
  }

  if (result.weightUsageRate >= 0.88) {
    list.push({
      level: 'warning',
      title: '重量接近上限',
      description: '建议复核单箱毛重、包装材料和实际装柜偏差，避免现场超重。',
    });
  }

  if (result.volumeUsageRate < 0.35) {
    list.push({
      level: 'info',
      title: '空间利用偏低',
      description: '如果对时效要求不高，可以评估拼箱、合并出货或者更小批量的方案。',
    });
  }

  if (result.unplacedQuantity > 0 && result.splitPlan) {
    list.push({
      level: 'warning',
      title: '建议拆柜',
      description: `当前估算仍有 ${result.unplacedQuantity} 件无法装入，建议至少拆成 ${result.splitPlan.sameContainerLabel}。`,
    });
  }

  return list;
}

export function buildRiskMessages(params: {
  cargo: CargoInput;
  container: ContainerSpec;
  originalContainer: ContainerSpec;
  options: CalculationOptions;
  canFitByCount: boolean;
  canFitByWeight: boolean;
  volumeUsageRate: number;
  weightUsageRate: number;
  unplacedQuantity: number;
  bestMaxFit: number;
  doorCheck: DoorCheckInfo;
}) {
  const messages: string[] = [];

  if (exceedsContainerInEveryOrientation(params.cargo, params.container)) {
    messages.push('单箱尺寸超过当前可用柜内空间，当前柜型无法装入。');
  }

  if (params.options.enforceDoorCheck && !params.doorCheck.canPassDoor) {
    messages.push('当前箱规无法通过柜门净宽 / 净高校验，存在现场卡门风险。');
  }

  if (!params.canFitByCount) {
    messages.push(`当前箱数超出该柜型理论最大装载数，预计仍有 ${params.unplacedQuantity} 箱无法装入。`);
  }

  if (!params.canFitByWeight) {
    messages.push('总重量超过当前安全载重上限，存在超重风险。');
  }

  if (params.cargo.weightKg >= params.options.floorWeightAlertKg) {
    messages.push(`单箱重量达到 ${params.cargo.weightKg} kg，建议关注叉车、人工搬运与地板受力。`);
  }

  if (params.options.reserveDoorSpaceCm > 0) {
    messages.push(`已预留柜门操作空间 ${params.options.reserveDoorSpaceCm} cm，结果更偏保守。`);
  }

  if (params.options.reserveTopSpaceCm > 0) {
    messages.push(`已预留顶部操作余量 ${params.options.reserveTopSpaceCm} cm。`);
  }

  if (params.options.reserveWeightBufferRate > 0) {
    messages.push(`已设置 ${(params.options.reserveWeightBufferRate * 100).toFixed(0)}% 重量缓冲，避免现场装柜偏差。`);
  }

  if (params.weightUsageRate > 0.9 && params.canFitByWeight) {
    messages.push('总重量已接近当前安全载重上限，建议复核毛重与实际装柜限制。');
  }

  if (params.volumeUsageRate < 0.35) {
    messages.push('体积利用率偏低，如对时效要求不高可考虑拼箱。');
  }

  if (params.volumeUsageRate > 0.95 && params.canFitByCount) {
    messages.push('体积利用率较高，实际装柜时建议预留装卸操作余量。');
  }

  if (params.bestMaxFit > 0 && params.unplacedQuantity === 0 && params.bestMaxFit - params.cargo.quantity <= 5) {
    messages.push('余量空间较小，建议预留包装误差和实际装柜损耗。');
  }

  if (params.originalContainer.volumeM3 > params.container.volumeM3 + 0.1) {
    messages.push('当前计算已扣除操作余量，不等同于满容积暴力装箱结果。');
  }

  return Array.from(new Set(messages));
}

export function getRiskLevel(messages: string[]): RiskLevel {
  const joined = messages.join('|');
  if (joined.includes('无法装入') || joined.includes('超过') || joined.includes('超重') || joined.includes('超出') || joined.includes('卡门')) {
    return 'high';
  }
  if (messages.length > 0) return 'medium';
  return 'low';
}

export function calculateContainerResult(
  cargo: CargoInput,
  rawContainer: ContainerSpec,
  options?: Partial<CalculationOptions>,
): ContainerCalculationResult {
  const normalizedOptions = normalizeOptions(options);
  const container = createEffectiveContainer(rawContainer, normalizedOptions);
  const orientations = getBoxOrientations(cargo);
  const doorCheck = evaluateDoorCheck(orientations, rawContainer, normalizedOptions.enforceDoorCheck);
  const best = getBestOrientation(container, orientations);

  const totalCargoVolumeM3 = calcTotalCargoVolumeM3(cargo);
  const totalCargoWeightKg = calcTotalCargoWeightKg(cargo);

  const loadedQuantity = Math.min(cargo.quantity, best.maxFitByCount);
  const unplacedQuantity = Math.max(0, cargo.quantity - loadedQuantity);

  const volumeUsageRate = safeDivide(totalCargoVolumeM3, container.volumeM3);
  const weightUsageRate = safeDivide(totalCargoWeightKg, container.maxPayloadKg);
  const countUsageRate = safeDivide(cargo.quantity, best.maxFitByCount || 1);

  const canFitByCount = cargo.quantity <= best.maxFitByCount;
  const canFitByWeight = totalCargoWeightKg <= container.maxPayloadKg;
  const canFit = canFitByCount && canFitByWeight && (!normalizedOptions.enforceDoorCheck || doorCheck.canPassDoor);
  const splitPlan = createSplitPlan(container, best.maxFitByCount, totalCargoVolumeM3, totalCargoWeightKg, cargo.quantity);

  const riskMessages = buildRiskMessages({
    cargo,
    container,
    originalContainer: rawContainer,
    options: normalizedOptions,
    canFitByCount,
    canFitByWeight,
    volumeUsageRate,
    weightUsageRate,
    unplacedQuantity,
    bestMaxFit: best.maxFitByCount,
    doorCheck,
  });

  return {
    containerCode: rawContainer.code,
    containerName: rawContainer.name,
    canFit,
    bestOrientation: best.orientation,
    maxFitByCount: best.maxFitByCount,
    requestedQuantity: cargo.quantity,
    loadedQuantity,
    unplacedQuantity,
    volumeUsageRate,
    weightUsageRate,
    countUsageRate,
    totalCargoVolumeM3,
    totalCargoWeightKg,
    remainVolumeM3: Math.max(0, container.volumeM3 - totalCargoVolumeM3),
    remainWeightKg: Math.max(0, container.maxPayloadKg - totalCargoWeightKg),
    riskLevel: getRiskLevel(riskMessages),
    riskMessages,
    layout: {
      perRow: best.perRow,
      perCol: best.perCol,
      perLayer: best.perLayer,
      totalLayers: best.totalLayers,
      drawnBoxes: Math.min(loadedQuantity, best.perLayer),
    },
    calculationMethod: 'rule',
    skuCount: 1,
    summaryLabel: `单箱规则计算 / ${getScenarioLabel(normalizedOptions.scenario)} / ${getDirectionLabel(normalizedOptions.loadDirection)}`,
    advice: buildCommonAdvice({
      canFit,
      volumeUsageRate,
      weightUsageRate,
      unplacedQuantity,
      containerName: rawContainer.name,
      scenario: normalizedOptions.scenario,
      splitPlan,
      doorCheck,
    }),
    optionsSnapshot: normalizedOptions,
    effectiveCapacity: {
      volumeM3: container.volumeM3,
      maxPayloadKg: container.maxPayloadKg,
      innerLengthCm: container.innerLengthCm,
      innerHeightCm: container.innerHeightCm,
    },
    doorCheck,
    splitPlan,
    operationChecklist: createOperationChecklist(normalizedOptions, false, normalizedOptions.enforceDoorCheck),
    weightDistribution: createWeightDistribution(totalCargoWeightKg, normalizedOptions),
  };
}

export function calculateMixedContainerResult(
  items: CargoItemInput[],
  rawContainer: ContainerSpec,
  options?: Partial<CalculationOptions>,
): ContainerCalculationResult {
  const normalizedOptions = normalizeOptions(options);
  const container = createEffectiveContainer(rawContainer, normalizedOptions);
  const normalizedItems = items.filter((item) => item.quantity > 0);
  const representative = pickRepresentativeItem(normalizedItems);
  const representativeBest = getBestOrientation(
    container,
    getBoxOrientations(representative),
    representative.maxStackLayers,
  );

  const totalQuantity = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCargoVolumeM3 = normalizedItems.reduce((sum, item) => sum + calcTotalCargoVolumeM3(item), 0);
  const totalCargoWeightKg = normalizedItems.reduce((sum, item) => sum + calcTotalCargoWeightKg(item), 0);

  const feasibleItems = normalizedItems.map((item) => {
    const stackLimit = item.fragile
      ? Math.min(item.maxStackLayers || Number.MAX_SAFE_INTEGER, 3)
      : item.maxStackLayers;

    const doorCheck = evaluateDoorCheck(getBoxOrientations(item), rawContainer, normalizedOptions.enforceDoorCheck);
    const best = getBestOrientation(container, getBoxOrientations(item), stackLimit);
    return {
      item,
      best,
      doorCheck,
      volumeM3: calcTotalCargoVolumeM3(item),
      weightKg: calcTotalCargoWeightKg(item),
      dimensionFit: best.maxFitByCount > 0,
    };
  });

  const volumeUsageRate = safeDivide(totalCargoVolumeM3, container.volumeM3);
  const weightUsageRate = safeDivide(totalCargoWeightKg, container.maxPayloadKg);

  const averageVolumePerUnit = safeDivide(totalCargoVolumeM3, totalQuantity);
  const averageWeightPerUnit = safeDivide(totalCargoWeightKg, totalQuantity);
  const estimatedCountByVolume = averageVolumePerUnit > 0 ? Math.floor(container.volumeM3 / averageVolumePerUnit) : 0;
  const estimatedCountByWeight = averageWeightPerUnit > 0 ? Math.floor(container.maxPayloadKg / averageWeightPerUnit) : 0;
  const estimatedMaxUnits = Math.min(
    estimatedCountByVolume || Number.MAX_SAFE_INTEGER,
    estimatedCountByWeight || Number.MAX_SAFE_INTEGER,
  );

  const allDimensionsFit = feasibleItems.every((entry) => entry.dimensionFit);
  const allDoorPass = feasibleItems.every((entry) => entry.doorCheck.canPassDoor);
  const canFit = allDimensionsFit && allDoorPass && volumeUsageRate <= 1 && weightUsageRate <= 1;
  const loadedQuantity = canFit ? totalQuantity : Math.min(totalQuantity, estimatedMaxUnits);
  const unplacedQuantity = Math.max(0, totalQuantity - loadedQuantity);
  const countUsageRate = estimatedMaxUnits > 0 ? safeDivide(totalQuantity, estimatedMaxUnits) : 1;
  const splitPlan = createSplitPlan(container, estimatedMaxUnits, totalCargoVolumeM3, totalCargoWeightKg, totalQuantity);

  const notes = [
    '多 SKU 模式采用体积 + 重量 + 尺寸可行性估算，适合前期测算与销售沟通。',
    `当前使用 ${getScenarioLabel(normalizedOptions.scenario)} 策略，已计入门口空间、顶部余量、重量缓冲与柜门净口检查。`,
  ];

  const riskMessages: string[] = [];
  if (!allDimensionsFit) {
    const dimensionFailed = feasibleItems.filter((entry) => !entry.dimensionFit).map((entry) => entry.item.skuName);
    riskMessages.push(`以下 SKU 在当前柜型下尺寸不可行：${dimensionFailed.join('、')}。`);
  }
  if (normalizedOptions.enforceDoorCheck && !allDoorPass) {
    const blocked = feasibleItems.filter((entry) => !entry.doorCheck.canPassDoor).map((entry) => entry.item.skuName);
    riskMessages.push(`以下 SKU 可能无法通过柜门：${blocked.join('、')}。`);
  }
  if (weightUsageRate > 1) {
    riskMessages.push('混装总重量超过当前安全载重上限，存在超重风险。');
  } else if (weightUsageRate > 0.9) {
    riskMessages.push('混装总重量已接近柜型上限，建议复核单箱毛重与码放方式。');
  }
  if (volumeUsageRate > 1) {
    riskMessages.push('混装总体积超过当前可用内容积，建议分柜或调整包装。');
  } else if (volumeUsageRate > 0.95) {
    riskMessages.push('混装体积利用率较高，实际操作建议预留装卸余量。');
  }
  if (volumeUsageRate < 0.35) {
    riskMessages.push('混装体积利用率偏低，可评估拼箱或合并出货。');
  }
  if (normalizedItems.some((item) => item.fragile)) {
    riskMessages.push('包含易碎 SKU，实际装柜时建议降低堆叠层数并增加防护。');
  }
  if (normalizedItems.some((item) => item.weightKg >= normalizedOptions.floorWeightAlertKg)) {
    riskMessages.push('存在重箱 SKU，建议评估人工搬运、托盘辅助与地板受力。');
  }
  if (normalizedOptions.reserveDoorSpaceCm > 0 || normalizedOptions.reserveTopSpaceCm > 0) {
    riskMessages.push('当前结果已纳入操作余量，较适合现场执行。');
  }
  if (unplacedQuantity > 0) {
    riskMessages.push(`按当前估算，约有 ${unplacedQuantity} 件无法装入该柜型。`);
  }

  const skuBreakdown: SkuBreakdownItem[] = feasibleItems.map((entry) => ({
    skuName: entry.item.skuName,
    quantity: entry.item.quantity,
    volumeM3: entry.volumeM3,
    weightKg: entry.weightKg,
    fragile: Boolean(entry.item.fragile),
    stackLimitLabel: entry.item.maxStackLayers ? `${entry.item.maxStackLayers} 层` : '不限',
    dimensionFit: entry.dimensionFit,
    doorPass: entry.doorCheck.canPassDoor,
  }));

  return {
    containerCode: rawContainer.code,
    containerName: rawContainer.name,
    canFit,
    bestOrientation: representativeBest.orientation,
    maxFitByCount: estimatedMaxUnits,
    requestedQuantity: totalQuantity,
    loadedQuantity,
    unplacedQuantity,
    volumeUsageRate,
    weightUsageRate,
    countUsageRate,
    totalCargoVolumeM3,
    totalCargoWeightKg,
    remainVolumeM3: Math.max(0, container.volumeM3 - totalCargoVolumeM3),
    remainWeightKg: Math.max(0, container.maxPayloadKg - totalCargoWeightKg),
    riskLevel: getRiskLevel(riskMessages),
    riskMessages: Array.from(new Set(riskMessages)),
    layout: {
      perRow: representativeBest.perRow,
      perCol: representativeBest.perCol,
      perLayer: representativeBest.perLayer,
      totalLayers: representativeBest.totalLayers,
      drawnBoxes: Math.min(representative.quantity, representativeBest.perLayer),
    },
    calculationMethod: 'heuristic',
    notes,
    skuCount: normalizedItems.length,
    summaryLabel: `多 SKU 估算 / ${getScenarioLabel(normalizedOptions.scenario)} / ${getDirectionLabel(normalizedOptions.loadDirection)}`,
    advice: buildCommonAdvice({
      canFit,
      volumeUsageRate,
      weightUsageRate,
      unplacedQuantity,
      containerName: rawContainer.name,
      scenario: normalizedOptions.scenario,
      splitPlan,
      doorCheck: {
        checked: normalizedOptions.enforceDoorCheck,
        canPassDoor: allDoorPass,
        passOrientations: [],
        blockedOrientations: [],
      },
    }),
    skuBreakdown,
    optionsSnapshot: normalizedOptions,
    effectiveCapacity: {
      volumeM3: container.volumeM3,
      maxPayloadKg: container.maxPayloadKg,
      innerLengthCm: container.innerLengthCm,
      innerHeightCm: container.innerHeightCm,
    },
    doorCheck: {
      checked: normalizedOptions.enforceDoorCheck,
      canPassDoor: allDoorPass,
      passOrientations: [],
      blockedOrientations: feasibleItems.filter((entry) => !entry.doorCheck.canPassDoor).map((entry) => entry.item.skuName),
    },
    splitPlan,
    operationChecklist: createOperationChecklist(normalizedOptions, normalizedItems.some((item) => item.fragile), normalizedOptions.enforceDoorCheck),
    weightDistribution: createWeightDistribution(totalCargoWeightKg, normalizedOptions),
  };
}

export function getRecommendedResult(results: ContainerCalculationResult[]) {
  const fitResults = results.filter((item) => item.canFit);

  if (fitResults.length > 0) {
    return [...fitResults].sort(
      (a, b) => CONTAINER_ORDER.indexOf(a.containerCode) - CONTAINER_ORDER.indexOf(b.containerCode),
    )[0];
  }

  return [...results].sort((a, b) => {
    if (a.unplacedQuantity !== b.unplacedQuantity) return a.unplacedQuantity - b.unplacedQuantity;
    return a.weightUsageRate - b.weightUsageRate;
  })[0];
}

export function createEmptySummary(): LoadCalculationSummary {
  return {
    mode: 'single',
    cargo: {
      lengthCm: 60,
      widthCm: 40,
      heightCm: 40,
      weightKg: 18,
      quantity: 500,
      allowRotate: true,
    },
    cargoItems: [],
    options: createDefaultOptions(),
    results: [],
    generatedAt: new Date().toISOString(),
  };
}
