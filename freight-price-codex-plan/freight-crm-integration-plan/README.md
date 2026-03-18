# 国际货代与 CRM 集成方案

本目录用于沉淀“国际货代业务单 + 芋道 CRM”的拆分集成方案，目标是避免把合同、回款、回款计划、客户资质继续堆进 `freight_order`，导致业务单模块过胖。

## 目录结构

```text
freight-crm-integration-plan/
  README.md
  01-architecture.md
  02-data-model.md
  03-menu-and-page-plan.md
  04-api-and-interaction-plan.md
  05-phase-and-task-plan.md
  06-phase-3-execution-plan.md
  sql/
    001_alter_freight_order_add_contract.sql
    002_create_crm_customer_bank_account.sql
    003_create_crm_customer_license.sql
    004_alter_crm_contract_add_bank_account.sql
    005_alter_crm_receivable_add_bank_account.sql
```

## 核心结论

- `freight_order` 只负责履约过程
- 合同、回款、回款计划复用芋道 CRM
- 客户银行账户、营业执照、资质附件扩在 CRM 客户下
- 业务单通过 `contract_id` 关联 CRM 合同

## 推荐业务链路

1. CRM 建客户
2. 客户下创建合同
3. 合同下创建业务单
4. 合同维度维护回款计划
5. 财务登记实际回款
6. 业务单只展示合同与回款摘要，不重复承载财务主流程

## 文档导航

- 架构边界：[01-architecture.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/01-architecture.md)
- 数据模型：[02-data-model.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/02-data-model.md)
- 菜单与页面规划：[03-menu-and-page-plan.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/03-menu-and-page-plan.md)
- 接口与交互规划：[04-api-and-interaction-plan.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/04-api-and-interaction-plan.md)
- 分期与任务清单：[05-phase-and-task-plan.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/05-phase-and-task-plan.md)
- 阶段三执行文档：[06-phase-3-execution-plan.md](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/06-phase-3-execution-plan.md)

## SQL 草案

- 业务单关联合同：[sql/001_alter_freight_order_add_contract.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/sql/001_alter_freight_order_add_contract.sql)
- 客户银行账户：[sql/002_create_crm_customer_bank_account.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/sql/002_create_crm_customer_bank_account.sql)
- 客户营业执照/资质：[sql/003_create_crm_customer_license.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/sql/003_create_crm_customer_license.sql)
- 合同绑定收款账户：[sql/004_alter_crm_contract_add_bank_account.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/sql/004_alter_crm_contract_add_bank_account.sql)
- 回款绑定收款账户：[sql/005_alter_crm_receivable_add_bank_account.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-crm-integration-plan/sql/005_alter_crm_receivable_add_bank_account.sql)
