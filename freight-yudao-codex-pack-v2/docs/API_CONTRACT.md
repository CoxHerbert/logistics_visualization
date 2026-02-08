# API_CONTRACT.md — Freight Tool Portal (Yudao Stack)

## 1) 前缀与客户端
- PC 管理端（yudao-ui-admin-vben）：`/admin-api`
- 移动端（yudao-ui-admin-uniapp）：`/app-api`
- 门户（logistics-tool-portal）：`/web-api`

---

## 2) 通用响应结构（示例）
> 以 CommonResult 风格示例；Codex 落地时必须沿用你项目现有统一响应体字段。

### 成功
```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

### 失败
```json
{
  "code": 400,
  "msg": "参数校验失败",
  "data": null
}
```

---

## 3) 错误码建议（MVP）
- 0：成功
- 400：参数错误
- 401：未登录（admin/app）
- 403：无权限（admin）
- 42901：提交过于频繁（防刷命中）
- 500：服务器异常

---

# 4) 门户 Web API（/web-api）

## 4.1 留资：创建线索
`POST /web-api/freight/lead/create`

### Request
```json
{
  "source": "WEB_FORM",
  "contactType": "WECHAT",
  "contactValue": "wxid_xxx",

  "name": "张三",
  "company": "XX跨境",

  "originPort": "宁波",
  "destination": "Los Angeles",
  "shipMode": "SEA_LCL",
  "cargoType": "GENERAL",

  "cartons": 10,
  "weightKg": 120.5,
  "volumeCbm": 1.23,

  "incoterms": "FOB",
  "fba": true,
  "amazonWarehouseCode": "ONT8",

  "expectation": "STABLE",
  "remark": "想走快船，尽量稳"
}
```

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": { "leadId": 10001 }
}
```

### 防刷命中 Response
```json
{
  "code": 42901,
  "msg": "提交过于频繁，请稍后再试",
  "data": null
}
```

---

## 4.2 工具：LCL 计算
`POST /web-api/freight/tool/lcl/calc`

### Request
```json
{
  "originPort": "宁波",
  "destination": "Los Angeles",
  "cargoType": "GENERAL",
  "cartons": 10,
  "weightKg": 120.5,
  "volumeCbm": 1.23,
  "incoterms": "FOB",
  "fba": true,
  "amazonWarehouseCode": "ONT8",
  "expectation": "STABLE"
}
```

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "costBreakdown": [
      { "name": "海运费", "unit": "CBM", "qty": 1.23, "unitPrice": 320.0, "amount": 393.6, "note": "参考价" },
      { "name": "起运港杂", "unit": "SHIPMENT", "qty": 1, "unitPrice": 80.0, "amount": 80.0, "note": "" },
      { "name": "文件费", "unit": "SHIPMENT", "qty": 1, "unitPrice": 35.0, "amount": 35.0, "note": "" }
    ],
    "total": 508.6,
    "currency": "USD",
    "notes": [
      "价格为工具参考，实际以实时舱位与货况确认",
      "旺季可能有甩柜风险，建议预留时间"
    ]
  }
}
```

---

## 4.3 工具：FCL 计算
`POST /web-api/freight/tool/fcl/calc`

### Request
```json
{
  "originPort": "宁波",
  "destination": "Los Angeles",
  "containerType": "40HQ",
  "cargoType": "GENERAL",
  "incoterms": "FOB",
  "expectation": "FAST"
}
```

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "costBreakdown": [
      { "name": "海运费", "unit": "CONTAINER", "qty": 1, "unitPrice": 4200.0, "amount": 4200.0, "note": "快船参考" },
      { "name": "港杂", "unit": "SHIPMENT", "qty": 1, "unitPrice": 260.0, "amount": 260.0, "note": "" }
    ],
    "total": 4460.0,
    "currency": "USD",
    "notes": [
      "整柜费用与拖车/提还柜/港区政策相关，建议提交货况获取真实报价",
      "滞箱/滞港费用需按船司及码头规则执行"
    ]
  }
}
```

---

## 4.4 工具：敏感品判断
`POST /web-api/freight/tool/sensitive/check`

### Request
```json
{
  "cargoType": "BATTERY",
  "description": "带锂电池小家电",
  "hasBattery": true,
  "hasMagnet": false,
  "hasLiquid": false,
  "hasPowder": false,
  "msdsProvided": false
}
```

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "riskLevel": "HIGH",
    "isSensitive": true,
    "requiredDocs": [
      "MSDS（必要时）",
      "UN38.3（如适用）",
      "电池/产品规格说明",
      "装箱单/商业发票"
    ],
    "notes": [
      "带电类目需确认电池类型与容量，可能需要额外鉴定/申报资料",
      "建议提交货物图片/链接以便确认可承运渠道"
    ]
  }
}
```

---

# 5) 管理端 Admin API（/admin-api）

## 5.1 线索分页
`GET /admin-api/freight/lead/page`

### Query Params
- pageNo=1
- pageSize=20
- status=NEW（可选）
- contactValue=wxid（可选，模糊）
- originPort=宁波（可选）
- destination=LA（可选）
- createTimeStart=2026-02-01 00:00:00（可选）
- createTimeEnd=2026-02-08 23:59:59（可选）

### Response（PageResult 示例）
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 10001,
        "source": "WEB_FORM",
        "contactType": "WECHAT",
        "contactValue": "wxid_xxx",
        "originPort": "宁波",
        "destination": "Los Angeles",
        "shipMode": "SEA_LCL",
        "cargoType": "GENERAL",
        "cartons": 10,
        "weightKg": 120.5,
        "volumeCbm": 1.23,
        "incoterms": "FOB",
        "fba": true,
        "amazonWarehouseCode": "ONT8",
        "expectation": "STABLE",
        "status": "NEW",
        "remark": null,
        "createTime": "2026-02-08 13:20:11"
      }
    ],
    "total": 1
  }
}
```

---

## 5.2 线索详情
`GET /admin-api/freight/lead/get?id=10001`

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 10001,
    "source": "WEB_FORM",
    "contactType": "WECHAT",
    "contactValue": "wxid_xxx",
    "name": "张三",
    "company": "XX跨境",
    "originPort": "宁波",
    "destination": "Los Angeles",
    "shipMode": "SEA_LCL",
    "cargoType": "GENERAL",
    "cartons": 10,
    "weightKg": 120.5,
    "volumeCbm": 1.23,
    "incoterms": "FOB",
    "fba": true,
    "amazonWarehouseCode": "ONT8",
    "expectation": "STABLE",
    "status": "NEW",
    "remark": "想走快船，尽量稳",
    "createTime": "2026-02-08 13:20:11",
    "updateTime": "2026-02-08 13:20:11"
  }
}
```

---

## 5.3 更新线索
`PUT /admin-api/freight/lead/update`

### Request
```json
{
  "id": 10001,
  "status": "CONTACTED",
  "remark": "已加微信，待客户发装箱单"
}
```

### Response
```json
{ "code": 0, "msg": "success", "data": true }
```

---

## 5.4 跟进记录列表
`GET /admin-api/freight/lead-activity/list?leadId=10001`

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 9001,
      "leadId": 10001,
      "type": "WECHAT",
      "content": "已添加微信，沟通货物属性",
      "creator": "admin",
      "createTime": "2026-02-08 13:40:02"
    }
  ]
}
```

---

## 5.5 新增跟进记录（管理端）
`POST /admin-api/freight/lead-activity/create`

### Request
```json
{
  "leadId": 10001,
  "type": "CALL",
  "content": "电话沟通，确认货物普货，预计下周装柜"
}
```

### Response
```json
{ "code": 0, "msg": "success", "data": { "activityId": 9002 } }
```

---

## 5.6 创建报价（含费用项）
`POST /admin-api/freight/quote/create`

### Request
```json
{
  "leadId": 10001,
  "currency": "USD",
  "validUntil": "2026-02-10 23:59:59",
  "transitDaysMin": 18,
  "transitDaysMax": 25,
  "scheduleNote": "快船参考，旺季建议预留时间",
  "terms": "以上报价不含海关查验、关税与不可抗力。",

  "items": [
    { "name": "海运费", "unit": "CBM", "qty": 1.23, "unitPrice": 320.0, "note": "参考价" },
    { "name": "起运港杂", "unit": "SHIPMENT", "qty": 1, "unitPrice": 80.0, "note": "" },
    { "name": "文件费", "unit": "SHIPMENT", "qty": 1, "unitPrice": 35.0, "note": "" }
  ]
}
```

### Response
```json
{ "code": 0, "msg": "success", "data": { "quoteId": 7001 } }
```

---

## 5.7 报价详情
`GET /admin-api/freight/quote/get?id=7001`

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 7001,
    "leadId": 10001,
    "currency": "USD",
    "validUntil": "2026-02-10 23:59:59",
    "transitDaysMin": 18,
    "transitDaysMax": 25,
    "scheduleNote": "快船参考，旺季建议预留时间",
    "terms": "以上报价不含海关查验、关税与不可抗力。",
    "total": 508.6,
    "fileUrl": null,
    "items": [
      { "id": 7101, "name": "海运费", "unit": "CBM", "qty": 1.23, "unitPrice": 320.0, "amount": 393.6, "note": "参考价" },
      { "id": 7102, "name": "起运港杂", "unit": "SHIPMENT", "qty": 1, "unitPrice": 80.0, "amount": 80.0, "note": "" }
    ],
    "createTime": "2026-02-08 14:10:11"
  }
}
```

---

## 5.8 按线索查询报价列表
`GET /admin-api/freight/quote/list-by-lead?leadId=10001`

### Response
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 7001,
      "leadId": 10001,
      "currency": "USD",
      "total": 508.6,
      "validUntil": "2026-02-10 23:59:59",
      "fileUrl": null,
      "createTime": "2026-02-08 14:10:11"
    }
  ]
}
```

---

# 6) 移动端 App API（/app-api）

## 6.1 新增跟进记录（移动端）
`POST /app-api/freight/lead-activity/create`

### Request
```json
{
  "leadId": 10001,
  "type": "NOTE",
  "content": "客户说货物下周才能发装箱单"
}
```

### Response
```json
{ "code": 0, "msg": "success", "data": { "activityId": 9003 } }
```

---

# 7) 导出策略（MVP：前端打印；后续增强：后端 PDF）
## 7.1 MVP（推荐）：PC 报价预览页 `window.print()`
- 不需要后端导出接口
- 浏览器打印 → 另存为 PDF（可直接发给客户）

## 7.2 后续增强：后端导出 PDF（可选）
`POST /admin-api/freight/quote/export-pdf?id=7001`
- 返回：文件下载流或 fileUrl
- 生成：HTML 模板 → PDF 工具（wkhtmltopdf/openhtmltopdf）
