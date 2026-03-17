import type { ContainerSpec } from '@/types/loadCalculator';

export const CONTAINER_ORDER: ContainerSpec['code'][] = ['20GP', '40GP', '40HQ'];

export const CONTAINER_SPECS: ContainerSpec[] = [
  {
    code: '20GP',
    name: '20GP 标准柜',
    innerLengthCm: 589,
    innerWidthCm: 235,
    innerHeightCm: 239,
    volumeM3: 33,
    maxPayloadKg: 28000,
    doorWidthCm: 234,
    doorHeightCm: 228,
  },
  {
    code: '40GP',
    name: '40GP 标准柜',
    innerLengthCm: 1203,
    innerWidthCm: 235,
    innerHeightCm: 239,
    volumeM3: 67,
    maxPayloadKg: 26500,
    doorWidthCm: 234,
    doorHeightCm: 228,
  },
  {
    code: '40HQ',
    name: '40HQ 高柜',
    innerLengthCm: 1203,
    innerWidthCm: 235,
    innerHeightCm: 269,
    volumeM3: 76,
    maxPayloadKg: 26500,
    doorWidthCm: 234,
    doorHeightCm: 258,
  },
];
