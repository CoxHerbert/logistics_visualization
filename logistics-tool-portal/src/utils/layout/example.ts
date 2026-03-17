import type { LayoutBuildInput } from '@/types/layout';
import { buildContainerLayout } from './layoutEngine';

export const demoLayoutInput: LayoutBuildInput = {
  containerCode: '40HQ',
  containerName: '40HQ',
  perRow: 10,
  perCol: 4,
  totalLayers: 5,
  totalBoxes: 150,
  items: [
    { skuId: 'SKU-A', skuName: '蓝牙耳机', quantity: 70, zoneType: 'normal' },
    { skuId: 'SKU-B', skuName: '玻璃水杯', quantity: 40, zoneType: 'fragile' },
    { skuId: 'SKU-C', skuName: '健身器材', quantity: 40, zoneType: 'heavy' },
  ],
};

export const demoLayout = buildContainerLayout(demoLayoutInput);
