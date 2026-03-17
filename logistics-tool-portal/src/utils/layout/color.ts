import { DEFAULT_LAYOUT_COLORS } from '@/constants/layoutColors';

export function getColorByIndex(index: number): string {
  return DEFAULT_LAYOUT_COLORS[index % DEFAULT_LAYOUT_COLORS.length];
}
