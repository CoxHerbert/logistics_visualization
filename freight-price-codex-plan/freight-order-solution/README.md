# 国际货代业务单方案

## 1. 目录结构

```text
freight-order-solution/
  README.md
  sql/
    001_create_freight_order.sql
```

---

## 2. 目标

在后台管理系统新增一个通用的国际货运代理业务流程模块，围绕一个主单据 `业务委托单（freight_order）` 展开，支持：

- 列表查询
- 新增 / 编辑表单
- 选择客户
- 状态流转
- 费用维护
- 操作日志
- 后续接入 BPM 审核

该方案适合海运整柜、海运拼箱、空运、铁路、卡航等常见国际货代场景。

---

## 3. 模块定位

建议后台菜单结构如下：

- 客户管理
- 业务单管理
- 费用管理
- 运价维护
- 单证管理
- 业务跟踪

本次先实现核心模块：`业务单管理`。

---

## 4. 业务流程

推荐状态流转：

1. `DRAFT` 草稿
2. `PENDING_REVIEW` 待审核
3. `PENDING_QUOTE` 待报价
4. `QUOTED` 已报价
5. `PENDING_BOOKING` 待订舱
6. `BOOKED` 已订舱
7. `CUSTOMS_PROCESSING` 报关中
8. `IN_TRANSIT` 运输中
9. `ARRIVED` 已到港
10. `SIGNED` 已签收
11. `COMPLETED` 已完成
12. `CANCELLED` 已取消

MVP 如果想先简化，可先启用这 6 个状态：

1. `DRAFT`
2. `PENDING_PROCESS`
3. `QUOTED`
4. `IN_TRANSIT`
5. `COMPLETED`
6. `CANCELLED`

---

## 5. 角色分工

- 销售：录入业务单、选择客户、报价、查看自己业务
- 操作：订舱、报关、运输跟踪
- 财务：维护应收应付费用
- 管理员：查看全部并处理异常状态

---

## 6. 列表页方案

页面名称：`业务单管理`

### 6.1 查询条件

- 业务编号 `orderNo`
- 客户 `customerId`
- 状态 `status`
- 运输方式 `transportMode`
- 起运港 `originPort`
- 目的港 `destinationPort`
- 订舱号 `bookingNo`
- 提单号 `blNo`
- 销售负责人 `salesUserId`
- 创建时间范围

### 6.2 列表字段

- ID
- 业务编号
- 客户名称
- 运输方式
- 业务类型
- 起运港
- 目的港
- 件数 / 毛重 / 体积
- 当前状态
- ETD
- ETA
- 订舱号
- 提单号
- 销售负责人
- 创建时间
- 操作

### 6.3 行操作

- 详情
- 编辑
- 提交审核
- 录入报价
- 推进状态
- 取消
- 查看日志

---

## 7. 表单页方案

页面名称：`业务单表单`

建议分为 5 个区块，避免字段堆在一起。

### 7.1 基础信息

- 客户 `customerId`
- 联系人 `contactName`
- 联系电话 `contactPhone`
- 销售负责人 `salesUserId`
- 操作负责人 `operatorUserId`
- 业务类型 `bizType`
- 运输方式 `transportMode`
- 贸易条款 `incoterms`
- 起运港 `originPort`
- 目的港 `destinationPort`
- 收货地址 `pickupAddress`
- 派送地址 `deliveryAddress`
- 船公司 / 航司 `carrierName`
- 备注 `remark`

### 7.2 货物信息

- 货物品名 `cargoName`
- HS Code `hsCode`
- 件数 `packageCount`
- 包装类型 `packageType`
- 毛重 KG `grossWeightKg`
- 体积 CBM `volumeCbm`
- 箱型箱量 `containerInfo`
- 是否带电 `hasBattery`
- 是否敏感货 `isSensitive`
- 报关方式 `customsType`
- 唛头 `shippingMark`

### 7.3 单证信息

- 订舱号 `bookingNo`
- SO 号 `soNo`
- 提单号 `blNo`
- 柜号 `containerNo`
- 封条号 `sealNo`
- 报关单号 `customsNo`

### 7.4 时间节点

- 预计提货时间 `pickupTime`
- ETD `etd`
- ETA `eta`
- 实际离港时间 `atd`
- 实际到港时间 `ata`
- 签收时间 `signTime`

### 7.5 费用信息

- 应收合计 `receivableAmount`
- 应付合计 `payableAmount`
- 利润 `profitAmount`
- 币种 `currency`
- 费用明细子表

---

## 8. 客户选择方案

客户不建议让业务员手填名称，建议强制选择主数据。

### 8.1 交互方式

- 表单字段使用远程搜索下拉
- 按客户名称、简称、联系人、手机号模糊匹配
- 选中后自动回填联系人、电话、默认贸易条款等信息

### 8.2 建议接口

- `GET /admin-api/crm/customer/simple-list?keyword=xxx`
- 返回：
  - `id`
  - `name`
  - `shortName`
  - `contactName`
  - `contactPhone`

---

## 9. 状态流转方案

不要做“任意状态修改”，要做成按钮驱动的有限流转。

### 9.1 推荐流转规则

- `DRAFT` -> `PENDING_REVIEW`
- `PENDING_REVIEW` -> `PENDING_QUOTE`
- `PENDING_REVIEW` -> `DRAFT`
- `PENDING_QUOTE` -> `QUOTED`
- `QUOTED` -> `PENDING_BOOKING`
- `PENDING_BOOKING` -> `BOOKED`
- `BOOKED` -> `CUSTOMS_PROCESSING`
- `CUSTOMS_PROCESSING` -> `IN_TRANSIT`
- `IN_TRANSIT` -> `ARRIVED`
- `ARRIVED` -> `SIGNED`
- `SIGNED` -> `COMPLETED`
- 任意处理中状态 -> `CANCELLED`

### 9.2 状态按钮建议

- 草稿：保存、提交审核、删除
- 待审核：审核通过、驳回
- 待报价：录入报价
- 已报价：确认成交、退回修改
- 待订舱：录入订舱信息
- 已订舱：发起报关
- 报关中：转运输中
- 运输中：到港登记
- 已到港：签收登记
- 已签收：业务完结
- 已取消：仅查看

### 9.3 日志要求

每次状态变化都记录到日志表，包括：

- 单据 ID
- 原状态
- 新状态
- 操作类型
- 操作说明
- 操作人
- 操作时间

---

## 10. 数据库表设计

SQL 脚本见 [sql/001_create_freight_order.sql](d:/workspace/logistics_visualization/freight-price-codex-plan/freight-order-solution/sql/001_create_freight_order.sql)。

建议先做 4 张核心表：

- `freight_order`
- `freight_order_cargo`
- `freight_order_fee`
- `freight_order_log`

---

## 11. Admin API 设计

后台接口建议如下。

### 11.1 分页查询

`GET /admin-api/freight/order/page`

查询参数：

- `pageNo`
- `pageSize`
- `orderNo`
- `customerId`
- `status`
- `transportMode`
- `originPort`
- `destinationPort`
- `salesUserId`
- `createTime[]`

### 11.2 详情

`GET /admin-api/freight/order/get?id=10001`

### 11.3 新增

`POST /admin-api/freight/order/create`

### 11.4 更新

`PUT /admin-api/freight/order/update`

### 11.5 删除

`DELETE /admin-api/freight/order/delete?id=10001`

### 11.6 状态流转

`PUT /admin-api/freight/order/update-status`

请求体建议：

```json
{
  "id": 10001,
  "fromStatus": "QUOTED",
  "toStatus": "PENDING_BOOKING",
  "remark": "客户确认成交"
}
```

### 11.7 日志列表

`GET /admin-api/freight/order/log/page?orderId=10001`

### 11.8 费用列表

`GET /admin-api/freight/order/fee/list?orderId=10001`

### 11.9 保存费用

`POST /admin-api/freight/order/fee/save`

---

## 12. 前端字段清单

如果使用 yudao-ui-admin-vben，可以按一个列表页 + 一个弹窗表单先落地。

### 12.1 查询表单

- 客户选择
- 状态下拉
- 运输方式下拉
- 起运港输入
- 目的港输入
- 业务编号输入
- 时间范围

### 12.2 表格列

- 业务编号
- 客户名称
- 运输方式
- 起运港
- 目的港
- 件毛体
- 状态 Tag
- ETD
- ETA
- 销售
- 创建时间
- 操作按钮

### 12.3 编辑表单

- 基础信息 Tab
- 货物信息 Tab
- 单证信息 Tab
- 费用信息 Tab
- 操作日志 Tab

如果你想快速上线，MVP 可以先不做 Tab，用分组卡片即可。

---

## 13. 枚举建议

### 13.1 运输方式

- `SEA_FCL`
- `SEA_LCL`
- `AIR`
- `RAIL`
- `TRUCK`

### 13.2 业务类型

- `EXPORT`
- `IMPORT`
- `FBA`
- `CROSS_BORDER`

### 13.3 贸易条款

- `EXW`
- `FOB`
- `CIF`
- `DDP`
- `DAP`

### 13.4 费用类型

- `RECEIVABLE`
- `PAYABLE`

---

## 14. 开发拆分建议

### 14.1 第一期 MVP

- 建主表和日志表
- 列表页
- 新增 / 编辑表单
- 客户下拉选择
- 状态字段和状态按钮
- 操作日志记录

### 14.2 第二期

- 费用明细子表
- 货物明细子表
- 单证扩展字段
- 权限细分

### 14.3 第三期

- BPM 审核流
- 自动编号
- 到港 / 延误提醒
- 利润统计报表

---

## 15. 推荐落地顺序

1. 先建 `freight_order` 和 `freight_order_log`
2. 完成后台 CRUD 接口
3. 完成管理端列表 + 弹窗表单
4. 接入客户远程搜索
5. 加状态流转接口和按钮
6. 最后补费用明细和子表

---

## 16. 结论

对于国际货代后台，最稳妥的做法不是一开始做复杂流程引擎，而是先把 `业务单` 作为核心主单据做扎实：

- 客户从主数据选择
- 状态按规则流转
- 列表用于运营查看
- 表单用于业务录入
- 日志保证可追溯

这样上线快，后续也容易继续接 BPM、报价、费用、对账和单证模块。
