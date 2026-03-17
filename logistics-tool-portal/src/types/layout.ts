export type DoorDirection = 'rear';
export type ZoneType = 'normal' | 'heavy' | 'fragile' | 'mixed';

export interface LayoutSkuLegendItem {
  skuId: string;
  skuName: string;
  color: string;
  zoneType?: ZoneType;
  quantity?: number;
}

export interface LayoutCell {
  rowIndex: number;
  colIndex: number;
  skuId: string;
  skuName: string;
  color: string;
  zoneType: ZoneType;
  label?: string;
}

export interface LayoutLayer {
  layerIndex: number;
  title: string;
  cells: LayoutCell[];
  rows: number;
  cols: number;
  boxCount: number;
}

export interface ContainerLayoutV2 {
  containerCode: string;
  containerName: string;
  doorDirection: DoorDirection;
  perRow: number;
  perCol: number;
  perLayer: number;
  totalLayers: number;
  totalBoxes: number;
  displayedLayerIndex: number;
  widthRatio: number;
  lengthRatio: number;
  layers: LayoutLayer[];
  legends: LayoutSkuLegendItem[];
  notes: string[];
}

export interface LayoutBuildItemInput {
  skuId: string;
  skuName: string;
  quantity: number;
  zoneType?: ZoneType;
}

export interface LayoutBuildInput {
  containerCode: string;
  containerName: string;
  perRow: number;
  perCol: number;
  totalLayers: number;
  totalBoxes: number;
  items: LayoutBuildItemInput[];
}
