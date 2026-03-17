<template>
  <a-card title="装柜结构图 V2" :bordered="false">
    <div class="preview-header">
      <div>
        <div class="headline">{{ layout.containerName }} · Layer {{ currentLayerIndex }} / {{ layout.totalLayers }}</div>
        <div class="meta">
          每排 {{ layout.perRow }} · 每列 {{ layout.perCol }} · 每层 {{ layout.perLayer }} · 总箱数 {{ layout.totalBoxes }}
        </div>
      </div>
    </div>

    <LayerTabs v-model="currentLayerIndex" :total-layers="layout.totalLayers" />

    <div class="preview-body">
      <div class="canvas-wrap">
        <svg :viewBox="viewBox" class="canvas-svg">
          <rect :x="padding" :y="padding" :width="bodyWidth" :height="bodyHeight" rx="12" class="container-shell" />

          <rect :x="padding + bodyWidth - doorDepth" :y="padding" :width="doorDepth" :height="bodyHeight" class="door-zone" />
          <text :x="padding + bodyWidth - doorDepth / 2" :y="padding + bodyHeight / 2" text-anchor="middle" class="door-text">柜门</text>

          <g v-for="cell in currentLayer.cells" :key="cell.label">
            <rect
              :x="padding + (cell.colIndex - 1) * cellWidth + gap / 2"
              :y="padding + (cell.rowIndex - 1) * cellHeight + gap / 2"
              :width="cellWidth - gap"
              :height="cellHeight - gap"
              rx="4"
              :fill="cell.color"
              class="box-cell"
            />
            <text
              v-if="showCellText && cellWidth > 42"
              :x="padding + (cell.colIndex - 1) * cellWidth + cellWidth / 2"
              :y="padding + (cell.rowIndex - 1) * cellHeight + cellHeight / 2 + 4"
              text-anchor="middle"
              class="cell-text"
            >
              {{ shortName(cell.skuName) }}
            </text>
            <circle
              v-if="cell.zoneType === 'heavy'"
              :cx="padding + (cell.colIndex - 1) * cellWidth + cellWidth - 9"
              :cy="padding + (cell.rowIndex - 1) * cellHeight + 9"
              r="6"
              class="badge-heavy"
            />
            <circle
              v-else-if="cell.zoneType === 'fragile'"
              :cx="padding + (cell.colIndex - 1) * cellWidth + cellWidth - 9"
              :cy="padding + (cell.rowIndex - 1) * cellHeight + 9"
              r="6"
              class="badge-fragile"
            />
          </g>

          <text :x="padding + 12" :y="padding + 20" class="front-label">前柜</text>
          <text :x="padding + bodyWidth / 2" :y="padding + bodyHeight + 22" text-anchor="middle" class="axis-label">柜长方向</text>
        </svg>
      </div>

      <div class="side-panel">
        <LayoutLegend :legends="layout.legends" />
        <a-alert type="info" show-icon message="说明" :description="layout.notes.join(' ')" />
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { ContainerLayoutV2 } from '@/types/layout';
import LayerTabs from './LayerTabs.vue';
import LayoutLegend from './LayoutLegend.vue';

const props = defineProps<{
  layout: ContainerLayoutV2;
}>();

const currentLayerIndex = ref(props.layout.displayedLayerIndex || 1);

watch(
  () => props.layout.displayedLayerIndex,
  (value) => {
    currentLayerIndex.value = value || 1;
  },
);

const currentLayer = computed(() => {
  return props.layout.layers.find((item) => item.layerIndex === currentLayerIndex.value) || props.layout.layers[0];
});

const padding = 16;
const totalWidth = 1200;
const totalHeight = 340;
const viewBox = `0 0 ${totalWidth} ${totalHeight}`;
const bodyWidth = 1120;
const bodyHeight = 220;
const doorDepth = 70;
const gap = 4;

const cellWidth = computed(() => bodyWidth / props.layout.perRow);
const cellHeight = computed(() => bodyHeight / props.layout.perCol);
const showCellText = computed(() => props.layout.perRow <= 10);

function shortName(name: string): string {
  if (!name) return '';
  return name.length <= 4 ? name : name.slice(0, 4);
}
</script>

<style scoped>
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.headline {
  font-size: 16px;
  font-weight: 600;
}
.meta {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
.preview-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
}
.canvas-wrap {
  width: 100%;
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
  padding: 12px;
}
.canvas-svg {
  width: 100%;
  min-width: 720px;
  height: auto;
}
.container-shell {
  fill: #ffffff;
  stroke: #222;
  stroke-width: 2;
}
.door-zone {
  fill: rgba(24, 144, 255, 0.08);
  stroke: rgba(24, 144, 255, 0.35);
  stroke-width: 1;
}
.door-text,
.axis-label,
.front-label,
.cell-text {
  fill: #333;
  font-size: 12px;
}
.box-cell {
  stroke: rgba(0, 0, 0, 0.12);
  stroke-width: 1;
}
.badge-heavy {
  fill: #fa8c16;
}
.badge-fragile {
  fill: #f5222d;
}
.side-panel {
  display: grid;
  gap: 12px;
  align-content: start;
}
@media (max-width: 992px) {
  .preview-body {
    grid-template-columns: 1fr;
  }
}
</style>
