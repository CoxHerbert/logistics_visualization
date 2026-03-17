import type {
  ContainerLayoutV2,
  LayoutBuildInput,
  LayoutCell,
  LayoutLayer,
  LayoutSkuLegendItem,
} from '@/types/layout';
import { getColorByIndex } from './color';

function createLegends(input: LayoutBuildInput): LayoutSkuLegendItem[] {
  return input.items.map((item, index) => ({
    skuId: item.skuId,
    skuName: item.skuName,
    color: getColorByIndex(index),
    zoneType: item.zoneType ?? 'normal',
    quantity: item.quantity,
  }));
}

function flattenCells(
  rows: number,
  cols: number,
  layerIndex: number,
  source: Array<{ skuId: string; skuName: string; color: string; zoneType: 'normal' | 'heavy' | 'fragile' | 'mixed'; quantity: number }>,
): LayoutCell[] {
  const capacity = rows * cols;
  const totalForLayer = Math.min(
    capacity,
    source.reduce((sum, item) => sum + item.quantity, 0),
  );

  const cells: LayoutCell[] = [];
  let pointer = 0;
  let rest = source.map((item) => ({ ...item }));

  for (let i = 0; i < totalForLayer; i += 1) {
    while (pointer < rest.length && rest[pointer].quantity <= 0) {
      pointer += 1;
    }
    if (pointer >= rest.length) break;

    const rowIndex = Math.floor(i / cols) + 1;
    const colIndex = (i % cols) + 1;
    const current = rest[pointer];

    cells.push({
      rowIndex,
      colIndex,
      skuId: current.skuId,
      skuName: current.skuName,
      color: current.color,
      zoneType: current.zoneType,
      label: `${layerIndex}-${rowIndex}-${colIndex}`,
    });

    current.quantity -= 1;
  }

  return cells;
}

export function buildContainerLayout(input: LayoutBuildInput): ContainerLayoutV2 {
  const legends = createLegends(input);
  const perLayer = input.perRow * input.perCol;
  const totalBoxes = Math.min(input.totalBoxes, perLayer * input.totalLayers);

  let remaining = legends.map((legend) => ({
    skuId: legend.skuId,
    skuName: legend.skuName,
    color: legend.color,
    zoneType: legend.zoneType ?? 'normal',
    quantity: legend.quantity ?? 0,
  }));

  const layers: LayoutLayer[] = [];

  for (let layerIndex = 1; layerIndex <= input.totalLayers; layerIndex += 1) {
    const layerCells = flattenCells(input.perCol, input.perRow, layerIndex, remaining);

    const usedCount = layerCells.length;
    let restCount = usedCount;
    remaining = remaining.map((item) => {
      if (restCount <= 0) return item;
      const take = Math.min(item.quantity, restCount);
      restCount -= take;
      return {
        ...item,
        quantity: item.quantity - take,
      };
    });

    layers.push({
      layerIndex,
      title: `Layer ${layerIndex}`,
      cells: layerCells,
      rows: input.perCol,
      cols: input.perRow,
      boxCount: layerCells.length,
    });
  }

  const notes = [
    '当前为结构化分层示意图，不代表毫米级精排结果。',
    '建议结合柜门方向、重货位置和现场操作余量综合判断。',
  ];

  return {
    containerCode: input.containerCode,
    containerName: input.containerName,
    doorDirection: 'rear',
    perRow: input.perRow,
    perCol: input.perCol,
    perLayer,
    totalLayers: input.totalLayers,
    totalBoxes,
    displayedLayerIndex: 1,
    widthRatio: 235,
    lengthRatio: 1203,
    layers,
    legends,
    notes,
  };
}
