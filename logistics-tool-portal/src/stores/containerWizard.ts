import { defineStore } from 'pinia';
import type { ContainerWizardState, WizardStep } from '@/types/containerWizard';

const createDefaultState = (): ContainerWizardState => ({
  currentStep: 0,
  cargoMode: 'single',
  singleCargoForm: {
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    weightKg: 18,
    quantity: 500,
    allowRotate: true,
  },
  palletForm: {
    enabled: false,
    preset: 'CN_120x100',
    lengthCm: 120,
    widthCm: 100,
    totalHeightCm: 150,
    palletWeightKg: 25,
    unitsPerPallet: 40,
    allowRotate: false,
  },
  multiSkuForm: [
    {
      id: Math.random().toString(36).slice(2, 10),
      skuName: 'SKU-1',
      lengthCm: 60,
      widthCm: 40,
      heightCm: 40,
      weightKg: 18,
      quantity: 100,
      allowRotate: true,
      fragile: false,
      heavy: false,
    },
  ],
  constraintForm: {
    selectedContainers: ['20GP', '40GP', '40HQ'],
    scenario: 'general',
    strategy: 'balanced',
    oceanFreightByContainer: {
      '20GP': 1800,
      '40GP': 2600,
      '40HQ': 2800,
    },
    reserveDoorCm: 10,
    reserveTopCm: 5,
    weightBufferRate: 0.1,
    enableDoorCheck: true,
    heavyForward: false,
    showAdvanced: false,
  },
  resultSummary: null,
  optimizationSuggestions: [],
  proposalMarkdown: '',
});

export const useContainerWizardStore = defineStore('containerWizard', {
  state: (): ContainerWizardState => createDefaultState(),
  actions: {
    setStep(step: WizardStep) {
      this.currentStep = step;
    },
    nextStep() {
      if (this.currentStep < 3) this.currentStep += 1;
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep -= 1;
    },
    patchSingleCargo(payload: Partial<ContainerWizardState['singleCargoForm']>) {
      this.singleCargoForm = { ...this.singleCargoForm, ...payload };
    },
    patchPallet(payload: Partial<ContainerWizardState['palletForm']>) {
      this.palletForm = { ...this.palletForm, ...payload };
    },
    patchMultiSkuItem(id: string, payload: Partial<ContainerWizardState['multiSkuForm'][number]>) {
      this.multiSkuForm = this.multiSkuForm.map((item) => (item.id === id ? { ...item, ...payload } : item));
    },
    addMultiSkuItem() {
      this.multiSkuForm.push({
        id: Math.random().toString(36).slice(2, 10),
        skuName: `SKU-${this.multiSkuForm.length + 1}`,
        lengthCm: 60,
        widthCm: 40,
        heightCm: 40,
        weightKg: 18,
        quantity: 100,
        allowRotate: true,
        fragile: false,
        heavy: false,
      });
    },
    removeMultiSkuItem(id: string) {
      if (this.multiSkuForm.length <= 1) return;
      this.multiSkuForm = this.multiSkuForm.filter((item) => item.id !== id);
    },
    setMultiSkuForm(items: ContainerWizardState['multiSkuForm']) {
      this.multiSkuForm = items.map((item) => ({ ...item }));
    },
    patchConstraint(payload: Partial<ContainerWizardState['constraintForm']>) {
      this.constraintForm = { ...this.constraintForm, ...payload };
    },
    setCargoMode(mode: ContainerWizardState['cargoMode']) {
      this.cargoMode = mode;
    },
    setResultSummary(summary: ContainerWizardState['resultSummary']) {
      this.resultSummary = summary;
    },
    setOptimizationSuggestions(list: ContainerWizardState['optimizationSuggestions']) {
      this.optimizationSuggestions = list;
    },
    setProposalMarkdown(markdown: string) {
      this.proposalMarkdown = markdown;
    },
    resetAll() {
      Object.assign(this, createDefaultState());
    },
  },
});
