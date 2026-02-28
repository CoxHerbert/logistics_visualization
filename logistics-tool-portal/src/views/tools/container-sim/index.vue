<template>
  <a-layout style="height: calc(100vh - 64px); background: #fff;">
    <a-layout-sider width="360" style="background:#fff; border-right:1px solid #f0f0f0; padding:16px; overflow:auto;">
      <a-typography-title :level="4" style="margin:0 0 12px;">整柜/拼箱 3D 装柜模拟</a-typography-title>

      <a-card size="small" title="柜型">
        <a-select v-model:value="selectedContainerId" style="width:100%" @change="onContainerChange">
          <a-select-option v-for="c in containerTypes" :key="c.id" :value="c.id">
            {{ c.name }}（{{ c.innerLength }}×{{ c.innerWidth }}×{{ c.innerHeight }} cm）
          </a-select-option>
        </a-select>
        <a-divider style="margin:12px 0;" />
        <div>最大载重：{{ currentContainer.maxWeight }} kg</div>
        <div>可用体积：{{ containerCBM.toFixed(2) }} CBM</div>
      </a-card>

      <a-card size="small" title="新增货物" style="margin-top:12px;">
        <a-form layout="vertical">
          <a-form-item label="SKU/名称">
            <a-input v-model:value="cargoForm.name" placeholder="例如：Carton A" />
          </a-form-item>
          <a-row :gutter="8">
            <a-col :span="8"><a-form-item label="长(cm)"><a-input-number v-model:value="cargoForm.l" :min="1" style="width:100%" /></a-form-item></a-col>
            <a-col :span="8"><a-form-item label="宽(cm)"><a-input-number v-model:value="cargoForm.w" :min="1" style="width:100%" /></a-form-item></a-col>
            <a-col :span="8"><a-form-item label="高(cm)"><a-input-number v-model:value="cargoForm.h" :min="1" style="width:100%" /></a-form-item></a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :span="12"><a-form-item label="重量(kg)"><a-input-number v-model:value="cargoForm.weight" :min="0" style="width:100%" /></a-form-item></a-col>
            <a-col :span="12"><a-form-item label="件数"><a-input-number v-model:value="cargoForm.qty" :min="1" style="width:100%" /></a-form-item></a-col>
          </a-row>
          <a-form-item label="可承受堆码重量上限(kg)">
            <a-input-number v-model:value="cargoForm.maxStackWeightKg" :min="0" style="width:100%" />
          </a-form-item>
          <a-form-item label="可旋转摆放（L/W 互换）">
            <a-switch v-model:checked="cargoForm.rotatable" checked-children="是" un-checked-children="否" />
          </a-form-item>
          <a-space>
            <a-button type="primary" @click="addCargo">加入列表</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-form>
      </a-card>

      <a-card size="small" title="货物列表" style="margin-top:12px;">
        <a-table size="small" :columns="columns" :data-source="cargoList" :pagination="false" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'rotatable'">
              <a-tag :color="record.rotatable ? 'green' : 'default'">{{ record.rotatable ? '可旋转' : '不可旋转' }}</a-tag>
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button size="small" @click="spawnBoxes(record)">摆放</a-button>
                <a-popconfirm title="删除该货物？" @confirm="removeCargo(record.id)">
                  <a-button size="small" danger>删</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-layout-sider>

    <a-layout>
      <a-layout-content style="display:flex; gap:12px; padding:12px;">
        <div style="flex:1; border:1px solid #f0f0f0; border-radius:8px; overflow:hidden; position:relative;">
          <div ref="canvasWrap" style="width:100%; height:100%;"></div>
          <div style="position:absolute; left:12px; top:12px; display:flex; flex-wrap:wrap; gap:4px;">
            <a-tag color="blue">点击空白：按当前层放置</a-tag>
            <a-tag color="gold">点击箱子：选中/拖拽/Delete 删除</a-tag>
            <a-tag color="purple">R 键旋转待放货物</a-tag>
          </div>
        </div>

        <div style="width:360px; overflow:auto;">
          <a-card size="small" title="统计 / 操作">
            <a-form layout="vertical">
              <a-form-item label="当前层（叠放）">
                <a-input-number v-model:value="activeLayer" :min="0" :max="50" style="width:100%" />
              </a-form-item>
              <a-form-item label="吸附开关">
                <a-switch v-model:checked="config.snapEnabled" checked-children="开" un-checked-children="关" />
              </a-form-item>
              <a-form-item label="网格大小 (cm)">
                <a-input-number v-model:value="config.snapGrid" :min="1" :max="50" style="width:100%" />
              </a-form-item>
              <a-form-item label="吸附容差 (cm)">
                <a-input-number v-model:value="config.snapTolerance" :min="0" :max="50" style="width:100%" />
              </a-form-item>
              <a-form-item label="货物间距/形变量 (cm)">
                <a-input-number v-model:value="config.boxGap" :min="0" :max="30" :step="0.5" style="width:100%" />
              </a-form-item>
              <a-form-item label="支撑比例 (0~1)">
                <a-input-number v-model:value="config.supportRatio" :min="0" :max="1" :step="0.05" style="width:100%" />
              </a-form-item>
              <a-form-item label="自动步长 (cm)">
                <a-input-number v-model:value="config.autoStep" :min="1" :max="50" style="width:100%" />
              </a-form-item>
              <a-form-item label="自动装箱策略">
                <a-select v-model:value="config.strategy" style="width:100%">
                  <a-select-option value="footprint">底面积优先</a-select-option>
                  <a-select-option value="volume">体积优先</a-select-option>
                  <a-select-option value="weight">重量优先</a-select-option>
                  <a-select-option value="height">高度优先</a-select-option>
                  <a-select-option value="best">多策略择优</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="门口预留深度 (cm)">
                <a-input-number v-model:value="config.doorAccessDepth" :min="0" :max="120" :step="1" style="width:100%" />
              </a-form-item>
              <a-form-item label="偏载容差比例">
                <a-input-number v-model:value="config.balanceToleranceRatio" :min="0" :max="0.5" :step="0.01" style="width:100%" />
              </a-form-item>
              <a-form-item label="场景模板">
                <a-space wrap>
                  <a-button size="small" @click="applyPreset('light')">轻抛货</a-button>
                  <a-button size="small" @click="applyPreset('heavy')">重货</a-button>
                  <a-button size="small" @click="applyPreset('deformable')">易变形货</a-button>
                </a-space>
              </a-form-item>
            </a-form>

            <div>已放置件数：{{ placedCount }}</div>
            <div>已占用体积：{{ usedCBM.toFixed(2) }} CBM</div>
            <div>体积利用率：{{ (usedCBM / containerCBM * 100).toFixed(1) }}%</div>
            <div>已占用重量：{{ usedWeight.toFixed(1) }} kg</div>
            <div>重量利用率：{{ (usedWeight / currentContainer.maxWeight * 100).toFixed(1) }}%</div>
            <div>重心偏移：X {{ balanceMetrics.offsetX.toFixed(1) }} cm / Z {{ balanceMetrics.offsetZ.toFixed(1) }} cm</div>
            <a-tag :color="balanceWarning ? 'red' : 'green'">{{ balanceWarning ? '偏载风险' : '偏载正常' }}</a-tag>

            <a-divider style="margin:8px 0;" />
            <a-space direction="vertical" style="width:100%">
              <a-button type="primary" block @click="handleAutoPackOne">单货自动摆放</a-button>
              <a-button block :loading="isAutoPacking" :disabled="isAutoPacking" @click="handleAutoPackAll">混装一键装柜</a-button>
              <a-button danger block @click="clearPlacedAll">清空摆放</a-button>
              <a-button block @click="exportPlan">导出 JSON 方案</a-button>
            </a-space>

            <a-divider v-if="autoPackFailureSummary.length" style="margin:10px 0;" />
            <div v-if="autoPackFailureSummary.length">
              <div style="margin-bottom:6px; font-weight:600;">未装入原因</div>
              <div v-for="item in autoPackFailureSummary" :key="item.reason" style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>{{ failReasonText[item.reason] }}</span>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </a-card>

          <a-card size="small" title="多柜可行性评估（整柜+拼箱）" style="margin-top:12px;">
            <a-form layout="vertical">
              <a-form-item label="最多柜数">
                <a-input-number v-model:value="maxContainerCount" :min="1" :max="20" style="width:100%" />
              </a-form-item>
              <a-form-item label="可用柜型（可多选）">
                <a-select v-model:value="multiContainerOptionIds" mode="multiple" style="width:100%">
                  <a-select-option v-for="c in containerTypes" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-space direction="vertical" style="width:100%">
                <a-button block @click="runFeasibility">评估方案</a-button>
                <a-button block @click="exportFeasibility" :disabled="!feasibilityResult">导出评估 JSON</a-button>
              </a-space>
            </a-form>

            <div v-if="feasibilityResult" style="margin-top:10px;">
              <div>可装入总件数：{{ feasibilityResult.placedCount }}</div>
              <div>拼箱剩余件数：{{ feasibilityResult.unplacedCount }}</div>
              <a-divider style="margin:8px 0;" />
              <div v-for="plan in feasibilityResult.plans" :key="`${plan.container.id}-${plan.serial}`" style="margin-bottom:8px;">
                柜{{ plan.serial }}：{{ plan.container.name }}，装入 {{ plan.placed.length }} 件
              </div>
            </div>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { createStage } from './three/stage';
import { createInteractions } from './three/interactions';
import { autoPackOne, calcBalanceMetrics, calcCBM, diagnoseUnplacedItem, expandAllItems, planMultiContainerFeasibility, tryPlaceItem } from './three/packing';
import { exportPlanAsJson } from './three/exporter';
import type { ExportUnplacedSummary } from './three/exporter';
import type { CargoItem, ContainerType, EngineConfig, MultiContainerFeasibility, PackStrategy, PlacedBox, SpawnState } from './three/types';
import type { PlacementFailReason } from './three/packing';

function uid() {
  return Math.random().toString(16).slice(2);
}

const containerTypes: ContainerType[] = [
  { id: '20gp', name: '20GP', innerLength: 589, innerWidth: 235, innerHeight: 239, maxWeight: 28000 },
  { id: '40gp', name: '40GP', innerLength: 1203, innerWidth: 235, innerHeight: 239, maxWeight: 28000 },
  { id: '40hq', name: '40HQ', innerLength: 1203, innerWidth: 235, innerHeight: 269, maxWeight: 28000 },
];

const selectedContainerId = ref('20gp');
const currentContainer = computed(() => containerTypes.find((c) => c.id === selectedContainerId.value) || containerTypes[0]);
const containerCBM = computed(() => calcCBM(currentContainer.value.innerLength, currentContainer.value.innerWidth, currentContainer.value.innerHeight));

const config = reactive<EngineConfig>({
  snapEnabled: true,
  snapGrid: 5,
  snapTolerance: 6,
  supportRatio: 0.6,
  autoStep: 5,
  boxGap: 0,
  balanceToleranceRatio: 0.18,
  strategy: 'best',
  doorAccessDepth: 0,
});

const cargoForm = reactive({ name: 'Carton A', l: 60, w: 40, h: 35, weight: 22, qty: 10, rotatable: true, maxStackWeightKg: 120 });
const cargoList = ref<CargoItem[]>([]);
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '尺寸', key: 'size', customRender: ({ record }: { record: CargoItem }) => `${record.l}×${record.w}×${record.h}` },
  { title: '件数', dataIndex: 'qty', key: 'qty' },
  { title: '旋转', key: 'rotatable' },
  { title: '操作', key: 'actions' },
];

const failReasonText: Record<PlacementFailReason, string> = {
  OUT_OF_BOUNDS: '尺寸超出柜内可用范围',
  COLLISION: '空间冲突（碰撞）',
  INSUFFICIENT_SUPPORT: '支撑不足（悬空风险）',
  OVER_STACK_LIMIT: '堆码承压超限',
  NO_LAYER_AVAILABLE: '高度不足，无法进入可用层',
  UNKNOWN: '无可行摆位',
};

const activeSpawn = ref<SpawnState | null>(null);
const activeLayer = ref(0);

const placedData = ref<PlacedBox[]>([]);
const placedCount = computed(() => placedData.value.length);
const usedCBM = computed(() => placedData.value.reduce((s, b) => s + calcCBM(b.l, b.w, b.h), 0));
const usedWeight = computed(() => placedData.value.reduce((s, b) => s + b.weight, 0));
const balanceMetrics = computed(() => calcBalanceMetrics(placedData.value, currentContainer.value));
const balanceWarning = computed(() => balanceMetrics.value.ratioX > config.balanceToleranceRatio || balanceMetrics.value.ratioZ > config.balanceToleranceRatio);

const maxContainerCount = ref(3);
const multiContainerOptionIds = ref<string[]>(containerTypes.map((x) => x.id));
const feasibilityResult = ref<MultiContainerFeasibility | null>(null);
const isAutoPacking = ref(false);
const autoPackFailureSummary = ref<Array<{ reason: PlacementFailReason; count: number }>>([]);
const autoPackUnplacedSummary = ref<ExportUnplacedSummary>([]);

function addCargo() {
  if (!cargoForm.name) return message.warning('请填写名称');
  if (!cargoForm.l || !cargoForm.w || !cargoForm.h) return message.warning('尺寸必须 > 0');
  cargoList.value.unshift({
    id: uid(),
    name: cargoForm.name,
    l: cargoForm.l,
    w: cargoForm.w,
    h: cargoForm.h,
    weight: cargoForm.weight || 0,
    qty: cargoForm.qty || 1,
    rotatable: cargoForm.rotatable,
    maxStackWeightKg: cargoForm.maxStackWeightKg || 0,
  });
  message.success('已加入货物列表');
}

function resetForm() {
  Object.assign(cargoForm, { name: '', l: 60, w: 40, h: 35, weight: 0, qty: 1, rotatable: true, maxStackWeightKg: 120 });
}

function removeCargo(id: string) {
  cargoList.value = cargoList.value.filter((x) => x.id !== id);
  if (activeSpawn.value?.cargoId === id) activeSpawn.value = null;
}

function spawnBoxes(item: CargoItem) {
  activeSpawn.value = {
    cargoId: item.id,
    name: item.name,
    l: item.l,
    w: item.w,
    h: item.h,
    weight: item.weight,
    remain: item.qty,
    rotatable: item.rotatable,
    rotated: false,
    maxStackWeightKg: item.maxStackWeightKg,
  };
  message.info('现在可在 3D 视窗点击空白放置；按 R 键可旋转待放货物');
}

const canvasWrap = ref<HTMLDivElement>();
let stage: ReturnType<typeof createStage> | null = null;
let interactions: ReturnType<typeof createInteractions> | null = null;

function getActiveLayerY(spawnH: number) {
  return activeLayer.value * spawnH;
}

function addPlaced(box: PlacedBox) {
  placedData.value.push(box);
  stage?.addPlacedMesh(box);
}

function removePlacedAt(index: number) {
  if (!stage) return;
  stage.removePlacedMesh(index);
  placedData.value.splice(index, 1);
}

function clearPlacedAll() {
  if (!stage) return;
  stage.clearPlaced();
  placedData.value.length = 0;
  autoPackFailureSummary.value = [];
  autoPackUnplacedSummary.value = [];
  interactions?.notifyMeshesChanged();
  message.success('已清空摆放');
}

function applyPreset(preset: 'light' | 'heavy' | 'deformable') {
  if (preset === 'light') {
    Object.assign(config, { snapGrid: 5, snapTolerance: 8, supportRatio: 0.55, autoStep: 10, boxGap: 0.5, balanceToleranceRatio: 0.22, strategy: 'footprint', doorAccessDepth: 0 });
    message.success('已应用轻抛货模板');
    return;
  }
  if (preset === 'heavy') {
    Object.assign(config, { snapGrid: 5, snapTolerance: 4, supportRatio: 0.85, autoStep: 5, boxGap: 0, balanceToleranceRatio: 0.12, strategy: 'weight', doorAccessDepth: 0 });
    message.success('已应用重货模板');
    return;
  }
  Object.assign(config, { snapGrid: 5, snapTolerance: 6, supportRatio: 0.7, autoStep: 5, boxGap: 2, balanceToleranceRatio: 0.18, strategy: 'footprint', doorAccessDepth: 0 });
  message.success('已应用易变形货模板');
}

function onContainerChange() {
  if (!stage) return;
  clearPlacedAll();
  stage.buildContainerBox(currentContainer.value);
  stage.controls.target.set(currentContainer.value.innerLength / 2, currentContainer.value.innerHeight / 3, currentContainer.value.innerWidth / 2);
  stage.controls.update();
}

function handleAutoPackOne() {
  if (!activeSpawn.value) return message.warning('先在左侧选择一个货物点击「摆放」');
  const placed = autoPackOne({
    spawn: activeSpawn.value,
    yLayer: getActiveLayerY(activeSpawn.value.h),
    placed: placedData.value,
    container: currentContainer.value,
    cfg: config,
  });
  placed.forEach(addPlaced);
  message.success(`单货自动摆放完成：放置 ${placed.length} 件（层=${activeLayer.value}）`);
}

async function handleAutoPackAll() {
  if (isAutoPacking.value) return;
  if (!cargoList.value.length) return message.warning('请先添加货物');

  isAutoPacking.value = true;
  clearPlacedAll();

  const runByStrategy = async (strategy: Exclude<PackStrategy, 'best'>) => {
    const queue = expandAllItems(cargoList.value, strategy);
    const computedPlaced: PlacedBox[] = [];
    let unplaced = 0;
    const failCounter = new Map<PlacementFailReason, number>();
    const unplacedByCargo = new Map<string, { cargoId: string; name: string; qty: number }>();

    const BATCH = 30;
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const fitted = tryPlaceItem({
        item,
        placed: computedPlaced,
        container: currentContainer.value,
        cfg: config,
      });

      if (fitted) {
        computedPlaced.push({ ...item, ...fitted });
      } else {
        unplaced += 1;
        const reason = diagnoseUnplacedItem({
          item,
          placed: computedPlaced,
          container: currentContainer.value,
          cfg: config,
        });
        failCounter.set(reason, (failCounter.get(reason) || 0) + 1);
        const prev = unplacedByCargo.get(item.cargoId);
        if (prev) prev.qty += 1;
        else unplacedByCargo.set(item.cargoId, { cargoId: item.cargoId, name: item.name, qty: 1 });
      }

      if (i % BATCH === 0) {
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
    }

    return {
      strategy,
      computedPlaced,
      unplaced,
      failSummary: [...failCounter.entries()].map(([reason, count]) => ({ reason, count })),
      unplacedSummary: [...unplacedByCargo.values()],
    };
  };

  const candidates: Exclude<PackStrategy, 'best'>[] = config.strategy === 'best'
    ? ['footprint', 'volume', 'weight', 'height']
    : [config.strategy];

  let best = await runByStrategy(candidates[0]);
  for (let i = 1; i < candidates.length; i++) {
    const attempt = await runByStrategy(candidates[i]);
    if (attempt.computedPlaced.length > best.computedPlaced.length) {
      best = attempt;
      continue;
    }
    if (attempt.computedPlaced.length === best.computedPlaced.length) {
      const aw = attempt.computedPlaced.reduce((s, b) => s + b.weight, 0);
      const bw = best.computedPlaced.reduce((s, b) => s + b.weight, 0);
      if (aw > bw) best = attempt;
    }
  }

  const RENDER_BATCH = 100;
  for (let i = 0; i < best.computedPlaced.length; i += RENDER_BATCH) {
    const batch = best.computedPlaced.slice(i, i + RENDER_BATCH);
    batch.forEach(addPlaced);
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  autoPackFailureSummary.value = best.failSummary;
  autoPackUnplacedSummary.value = best.unplacedSummary;
  isAutoPacking.value = false;
  message.success(`混装完成：放置 ${best.computedPlaced.length} 件，未放入 ${best.unplaced} 件（策略=${best.strategy}）`);
}

function runFeasibility() {
  if (!cargoList.value.length) return message.warning('请先添加货物');
  const options = containerTypes.filter((c) => multiContainerOptionIds.value.includes(c.id));
  if (!options.length) return message.warning('请至少选择一种柜型');

  feasibilityResult.value = planMultiContainerFeasibility({
    cargoList: cargoList.value,
    containerOptions: options,
    cfg: config,
    maxContainers: maxContainerCount.value,
  });

  message.success(`评估完成：整柜装入 ${feasibilityResult.value.placedCount} 件，拼箱剩余 ${feasibilityResult.value.unplacedCount} 件`);
}

function exportPlan() {
  exportPlanAsJson({
    container: currentContainer.value,
    placed: placedData.value,
    unplacedSummary: autoPackUnplacedSummary.value,
    failureSummary: autoPackFailureSummary.value,
    balanceSummary: {
      centroidX: balanceMetrics.value.centroidX,
      centroidZ: balanceMetrics.value.centroidZ,
      offsetX: balanceMetrics.value.offsetX,
      offsetZ: balanceMetrics.value.offsetZ,
      ratioX: balanceMetrics.value.ratioX,
      ratioZ: balanceMetrics.value.ratioZ,
      toleranceRatio: config.balanceToleranceRatio,
      isUnbalanced: balanceWarning.value,
    },
  });
}

function exportFeasibility() {
  if (!feasibilityResult.value) return;
  const payload = {
    generatedAt: new Date().toISOString(),
    options: multiContainerOptionIds.value,
    maxContainers: maxContainerCount.value,
    ...feasibilityResult.value,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'multi-container-feasibility.json';
  a.click();
  URL.revokeObjectURL(url);
}

onMounted(() => {
  if (!canvasWrap.value) return;

  stage = createStage(canvasWrap.value, currentContainer.value);
  stage.start();

  interactions = createInteractions({
    renderer: stage.renderer,
    camera: stage.camera,
    controls: stage.controls,
    placedMeshes: stage.placedMeshes,
    getPlacedData: () => placedData.value,
    getContainer: () => currentContainer.value,
    getConfig: () => config,
    getActiveLayerY,
    getActiveSpawn: () => activeSpawn.value,
    addPlaced,
    removePlacedAt,
  });
  interactions.bind();

  const onResize = () => stage?.resize();
  window.addEventListener('resize', onResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    interactions?.unbind();
    stage?.dispose();
    stage = null;
    interactions = null;
  });
});
</script>
