# 02 数据模型设计

## 1. 现有核心表

建议继续沿用以下现有主表：

- `crm_customer`
- `crm_contract`
- `crm_receivable_plan`
- `crm_receivable`
- `freight_order`

## 2. freight_order 改造

### 新增字段

建议在 `freight_order` 增加以下字段：

- `contract_id`
- `contract_no`
- `contract_name`

### 字段说明

- `contract_id`
  主关联字段，必须保留，所有业务联动以它为准
- `contract_no`
  合同编号快照，便于列表展示、导出、审计
- `contract_name`
  合同名称快照，便于详情展示

### 为什么保留快照字段

- 合同后续可能改名
- 业务单导出和报表不希望每次联表
- 列表性能更稳定

## 3. 新增客户银行账户表

表名：`crm_customer_bank_account`

建议字段：

- `id`
- `customer_id`
- `account_name`
- `bank_name`
- `bank_account_no`
- `swift_code`
- `currency`
- `is_default`
- `remark`
- `creator`
- `create_time`
- `updater`
- `update_time`
- `deleted`

如你线上是多租户结构，再补：

- `tenant_id`

### 字段含义

- `account_name`
  户名
- `bank_name`
  开户行
- `bank_account_no`
  银行账号
- `swift_code`
  国际汇款用 Swift
- `currency`
  账户币种
- `is_default`
  是否默认收款账户

## 4. 新增客户资质表

表名：`crm_customer_license`

建议字段：

- `id`
- `customer_id`
- `license_type`
- `license_no`
- `company_name`
- `expire_date`
- `attachment_url`
- `remark`
- `creator`
- `create_time`
- `updater`
- `update_time`
- `deleted`

如你线上是多租户结构，再补：

- `tenant_id`

### 资质类型建议

- `BUSINESS_LICENSE`
- `TAX_REGISTRATION`
- `ORGANIZATION_CODE`
- `CUSTOMS_REGISTRATION`
- `OTHER`

## 5. 关系约束建议

### freight_order -> crm_contract

- 外键逻辑上关联
- 数据库层可以先不加物理外键，避免影响现网演进
- 业务层必须校验 `contract_id` 合法且属于同一客户

### crm_customer_bank_account -> crm_customer

- 一对多
- 删除客户前需要检查是否允许级联删除

### crm_customer_license -> crm_customer

- 一对多
- 建议逻辑删除

## 6. 详情展示聚合字段

业务单详情页建议额外展示的合同汇总字段：

- 合同编号
- 合同名称
- 合同金额
- 已回款金额
- 待回款金额
- 回款计划期数

这些字段可以通过聚合接口返回，不建议直接冗余在 `freight_order` 表。

