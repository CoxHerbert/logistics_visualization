import type { ClientProposalExportInput, CostedPlan } from '@/types/v7Costing';

function formatCurrency(value: number, currency: string): string {
  return `${currency} ${value.toFixed(2)}`;
}

function renderPlan(plan: CostedPlan, currency: string, title: string): string {
  const containerText = plan.containers.map((item) => `${item.count} x ${item.containerCode}`).join(' + ');

  return `## ${title}
- 柜型组合: ${containerText}
- 柜数: ${plan.totalContainerCount}
- 体积利用率: ${(plan.estimatedVolumeUsageRate * 100).toFixed(1)}%
- 重量利用率: ${(plan.estimatedWeightUsageRate * 100).toFixed(1)}%
- 风险等级: ${plan.riskLevel}
- 总成本: ${formatCurrency(plan.costBreakdown.totalCost, currency)}
- 单柜成本: ${formatCurrency(plan.costPerContainer, currency)}
- 单件成本: ${formatCurrency(plan.costPerUnit, currency)}
- 每 CBM 成本: ${formatCurrency(plan.costPerCbm, currency)}
- 每 KG 成本: ${formatCurrency(plan.costPerKg, currency)}
- 说明: ${plan.summaryText ?? '综合方案'}
`;
}

export function exportClientProposalMarkdown(input: ClientProposalExportInput): string {
  const parts: string[] = [];
  parts.push('# 装柜方案建议单');
  if (input.customerName) parts.push(`客户: ${input.customerName}`);
  parts.push('');
  parts.push('## 货物摘要');
  parts.push(`- 总件数: ${input.cargoSummary.totalQuantity}`);
  parts.push(`- 总体积: ${input.cargoSummary.totalVolumeM3.toFixed(2)} m3`);
  parts.push(`- 总重量: ${input.cargoSummary.totalWeightKg.toFixed(2)} kg`);
  parts.push(`- SKU 数: ${input.cargoSummary.skuCount}`);
  parts.push('');

  if (input.recommended) {
    parts.push(renderPlan(input.recommended, input.currency, '推荐方案'));
  }

  if (input.alternatives.length > 0) {
    parts.push('## 备选方案');
    input.alternatives.forEach((plan, index) => {
      parts.push(renderPlan(plan, input.currency, `备选方案 ${index + 1}`));
    });
  }

  parts.push('## 说明');
  parts.push('- 本方案为业务测算结果，实际费用以订舱、船期、港杂和现场操作为准。');
  parts.push('- 若货物包装、箱规、重量发生变化，方案与成本会同步变化。');

  return parts.join('\n');
}
