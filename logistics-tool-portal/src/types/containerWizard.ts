import type { ContainerLayoutV2 } from '@/types/layout';

export type WizardStep = 0 | 1 | 2 | 3;
export type CargoMode = 'single' | 'multiSku';
export type BusinessScenario = 'general' | 'fba' | 'traditional' | 'fragile';
export type LoadingStrategy = 'conservative' | 'balanced' | 'aggressive';

export interface SingleCargoForm {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  allowRotate: boolean;
}

export interface PalletForm {
  enabled: boolean;
  preset: 'CN_120x100' | 'EU_120x80' | 'US_121x101' | 'custom';
  lengthCm: number;
  widthCm: number;
  totalHeightCm: number;
  palletWeightKg: number;
  unitsPerPallet: number;
  allowRotate: boolean;
}

export interface SkuCargoItem {
  id: string;
  skuName: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  allowRotate: boolean;
  maxStackLayers?: number;
  fragile?: boolean;
  heavy?: boolean;
}

export interface ConstraintForm {
  selectedContainers: string[];
  scenario: BusinessScenario;
  strategy: LoadingStrategy;
  oceanFreightByContainer: {
    '20GP': number;
    '40GP': number;
    '40HQ': number;
  };
  reserveDoorCm: number;
  reserveTopCm: number;
  weightBufferRate: number;
  enableDoorCheck: boolean;
  heavyForward: boolean;
  showAdvanced: boolean;
}

export interface WizardResultSummary {
  recommendedPlan: Record<string, unknown> | null;
  alternativePlans: Array<Record<string, unknown>>;
  riskMessages: string[];
  layout: ContainerLayoutV2 | null;
  planPreviews: WizardPlanPreview[];
}

export interface WizardPlanPreview {
  planId: string;
  title: string;
  layouts: WizardLayoutPreview[];
}

export interface WizardLayoutPreview {
  id: string;
  title: string;
  layout: ContainerLayoutV2;
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact?: string;
  level: 'info' | 'warning' | 'success';
}

export interface ContainerWizardState {
  currentStep: WizardStep;
  cargoMode: CargoMode;
  singleCargoForm: SingleCargoForm;
  palletForm: PalletForm;
  multiSkuForm: SkuCargoItem[];
  constraintForm: ConstraintForm;
  resultSummary: WizardResultSummary | null;
  optimizationSuggestions: OptimizationSuggestion[];
  proposalMarkdown: string;
}
