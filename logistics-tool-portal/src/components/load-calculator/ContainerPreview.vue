<template>
  <a-card class="section-card" title="装柜预览" :bordered="false">
    <template v-if="result">
      <div class="preview-legend" style="margin-bottom: 12px;">
        <span><i class="preview-dot" style="background: #1677ff"></i> 已装箱体</span>
        <span><i class="preview-dot" style="background: #d0d5dd"></i> 空余位置</span>
        <span>第一层展示 / 共 {{ result.layout.totalLayers }} 层</span>
      </div>
      <div v-if="result.calculationMethod === 'heuristic'" class="table-note" style="margin-bottom: 12px;">
        当前为多 SKU 估算预览：画面按代表 SKU 的第一层布局展示，用于快速判断空间感，不代表每个 SKU 的最终摆放位置。
      </div>
      <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" width="100%" :style="{ maxWidth: '100%', background: '#f8fafc', borderRadius: '16px', border: '1px solid #eaecf0' }">
        <rect x="16" y="16" :width="innerWidth" :height="innerHeight" rx="14" fill="#eef4ff" stroke="#98a2b3" stroke-width="2" />
        <line v-if="doorSpacePx > 0" :x1="16 + innerWidth - doorSpacePx" y1="16" :x2="16 + innerWidth - doorSpacePx" :y2="16 + innerHeight" stroke="#f59e0b" stroke-dasharray="6 4" stroke-width="2" />
        <g v-for="box in boxes" :key="box.id">
          <rect :x="box.x" :y="box.y" :width="box.width" :height="box.height" rx="4" :fill="box.filled ? '#1677ff' : '#d0d5dd'" :opacity="box.filled ? 0.9 : 0.55" />
        </g>
      </svg>
      <a-row :gutter="12" style="margin-top: 16px;">
        <a-col :xs="12" :md="4"><a-statistic title="每排" :value="result.layout.perRow" /></a-col>
        <a-col :xs="12" :md="4"><a-statistic title="每列" :value="result.layout.perCol" /></a-col>
        <a-col :xs="12" :md="4"><a-statistic title="每层" :value="result.layout.perLayer" /></a-col>
        <a-col :xs="12" :md="4"><a-statistic title="总层数" :value="result.layout.totalLayers" /></a-col>
        <a-col :xs="12" :md="4"><a-statistic title="门口预留(cm)" :value="result.optionsSnapshot?.reserveDoorSpaceCm || 0" /></a-col>
        <a-col :xs="12" :md="4"><a-statistic title="顶部预留(cm)" :value="result.optionsSnapshot?.reserveTopSpaceCm || 0" /></a-col>
      </a-row>
    </template>
    <a-empty v-else description="暂无预览结果" />
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { ContainerCalculationResult } from '@/types/loadCalculator';

interface PreviewBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  filled: boolean;
}

const props = defineProps<{
  result?: ContainerCalculationResult;
}>();

const svgWidth = 720;
const svgHeight = 360;
const innerWidth = 680;
const innerHeight = 320;

const doorSpacePx = computed(() => {
  const reserve = props.result?.optionsSnapshot?.reserveDoorSpaceCm || 0;
  const effectiveLength = props.result?.effectiveCapacity?.innerLengthCm || 1;
  return Math.min(innerWidth * (reserve / (reserve + effectiveLength)), innerWidth * 0.2);
});

const boxes = computed<PreviewBox[]>(() => {
  const result = props.result;
  if (!result || result.layout.perRow <= 0 || result.layout.perCol <= 0) return [];

  const totalSlots = result.layout.perRow * result.layout.perCol;
  const cellWidth = innerWidth / result.layout.perRow;
  const cellHeight = innerHeight / result.layout.perCol;
  const boxesList: PreviewBox[] = [];
  const filledCount = Math.min(result.layout.drawnBoxes, totalSlots);

  for (let row = 0; row < result.layout.perCol; row += 1) {
    for (let col = 0; col < result.layout.perRow; col += 1) {
      const index = row * result.layout.perRow + col;
      boxesList.push({
        id: `${row}-${col}`,
        x: 16 + col * cellWidth + 4,
        y: 16 + row * cellHeight + 4,
        width: Math.max(cellWidth - 8, 10),
        height: Math.max(cellHeight - 8, 10),
        filled: index < filledCount,
      });
    }
  }

  return boxesList;
});
</script>
