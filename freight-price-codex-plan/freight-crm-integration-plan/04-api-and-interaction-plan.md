# 04 接口与交互规划

## 1. Freight 一期接口改造

### 业务单保存

在现有接口中增加合同字段：

- `POST /admin-api/freight/order/create`
- `PUT /admin-api/freight/order/update`

请求体建议增加：

```json
{
  "customerId": 12,
  "contractId": 1001
}
```

### 业务单详情

建议在详情接口中补充合同摘要 VO：

```json
{
  "id": 14,
  "orderNo": "FO202603180001",
  "customerId": 12,
  "contractId": 1001,
  "contractSummary": {
    "id": 1001,
    "no": "HT202603001",
    "name": "2026年美西海运框架合同",
    "totalPrice": 500000,
    "receivedPrice": 180000,
    "unreceivedPrice": 320000
  }
}
```

### 按客户查询合同精简列表

建议新增一个合同精简接口，供 freight 表单下拉调用：

`GET /admin-api/crm/contract/simple-list-by-customer?customerId=12&keyword=xxx`

返回建议：

```json
[
  {
    "id": 1001,
    "no": "HT202603001",
    "name": "2026年美西海运框架合同",
    "customerId": 12
  }
]
```

### 按合同查询业务单列表

建议新增 freight 精简列表接口：

`GET /admin-api/freight/order/page-by-contract?contractId=1001`

用于 CRM 合同详情页的“关联业务单”Tab。

## 2. CRM 客户扩展接口

建议增加两个标准 CRUD 模块。

### 客户银行账户

- `POST /admin-api/crm/customer-bank-account/create`
- `PUT /admin-api/crm/customer-bank-account/update`
- `DELETE /admin-api/crm/customer-bank-account/delete?id=`
- `GET /admin-api/crm/customer-bank-account/get?id=`
- `GET /admin-api/crm/customer-bank-account/list-by-customer?customerId=`

### 客户资质

- `POST /admin-api/crm/customer-license/create`
- `PUT /admin-api/crm/customer-license/update`
- `DELETE /admin-api/crm/customer-license/delete?id=`
- `GET /admin-api/crm/customer-license/get?id=`
- `GET /admin-api/crm/customer-license/list-by-customer?customerId=`

## 3. 表单交互建议

### 业务单创建

交互顺序建议：

1. 选择客户
2. 异步拉取该客户合同列表
3. 选择合同
4. 回填合同编号 / 名称快照
5. 继续录入履约信息

### 合同详情中的关联业务单

建议直接复用业务单表格组件的精简版，而不是另起一套页面。

### 客户详情中的银行账户 / 资质

建议用 Tab + Table + 弹窗 Form 的标准 CRUD 交互。

## 4. 权限建议

### Freight

- `freight:order:query`
- `freight:order:create`
- `freight:order:update`

### CRM 客户扩展

- `crm:customer-bank-account:query`
- `crm:customer-bank-account:create`
- `crm:customer-bank-account:update`
- `crm:customer-bank-account:delete`

- `crm:customer-license:query`
- `crm:customer-license:create`
- `crm:customer-license:update`
- `crm:customer-license:delete`

