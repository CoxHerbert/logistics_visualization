<template>
  <a-card :bordered="false">
    <a-steps :current="currentStep" size="small">
      <a-step
        v-for="item in steps"
        :key="item.key"
        :title="item.title"
        :description="item.description"
      />
    </a-steps>
  </a-card>
</template>

<script lang="ts" setup>
import { WIZARD_STEPS } from '@/utils/wizardSteps';

withDefaults(defineProps<{ currentStep: number }>(), {
  currentStep: 0,
});

const steps = WIZARD_STEPS;
</script>
