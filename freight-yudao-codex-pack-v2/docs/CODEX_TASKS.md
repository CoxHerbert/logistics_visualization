# CODEX_TASKS.md — Freight Tool Portal (Yudao Stack)

> 适用你的现状：MySQL + ruoyi-vue-pro 后端 + yudao-ui-admin-vben PC 管理端 + yudao-ui-admin-uniapp 移动端 + logistics-tool-portal（Vue3 门户）
>
> 已确定前缀：
> - 管理端：`/admin-api`
> - 移动端：`/app-api`
> - 门户：`/web-api`

---

## 0) 目标与闭环

### 业务闭环（MVP）
1) 门户工具页（LCL/FCL/敏感品）  
2) 留资（Lead）  
3) PC 管理端线索工作台（跟进/状态）  
4) 报价（Quote/Items）  
5) 报价单导出（**先“前端打印另存为 PDF”**，后续再升级后端 PDF）

### 单体多前缀说明
单体应用可以同时提供多个 API 前缀。推荐做法：
- Controller 使用 `@RequestMapping("/admin-api/...")`、`@RequestMapping("/web-api/...")`、`@RequestMapping("/app-api/...")` 显式区分
- 安全配置对不同前缀分别放行/鉴权
- 前端各自配置 baseURL 指向自己的前缀

---

## 1) 仓库与职责

### A. ruoyi-vue-pro（后端）
- 建表：`freight_lead` / `freight_lead_activity` / `freight_quote` / `freight_quote_item` / `freight_rule_config`
- 提供接口：
  - `web-api`（匿名 + 防刷）：给门户用
  - `admin-api`（鉴权 + 权限）：给 PC 管理端用
  - `app-api`（鉴权/登录）：给移动端用

### B. logistics-tool-portal（门户，Vue3）
- 工具页：`/tools/sea-lcl`、`/tools/sea-fcl`、`/tools/sensitive-check`
- 留资：`/get-plan`
- 个人入口：`/me`
- API base：`/web-api`

### C. yudao-ui-admin-vben（PC 管理端）
- 线索列表/详情/状态流转
- 跟进记录时间线
- 报价编辑器（费用项增删 + 合计）
- 报价预览（支持打印另存 PDF）

### D. yudao-ui-admin-uniapp（移动端）
- 线索列表/详情
- 快速新增跟进记录
- 一键联系（复制微信/拨号）

---

## 2) 全局工程约束（Codex 每个任务都要遵守）

1) 后端严格遵循项目既有分层：Controller / Service / Mapper / DO / Convert / VO  
2) 接口返回使用项目统一响应体（CommonResult / R / AjaxResult 等），**不得自创新结构**  
3) `admin-api`：必须加权限点（`@PreAuthorize`）与菜单资源  
4) `web-api`：匿名可访问，但要实现最小防刷（见 T1.3）  
5) VO 使用校验注解（javax validation）  
6) 每个任务的交付必须包含：
   - ✅ 改动文件列表（含路径）
   - ✅ 如何启动与联调（命令 + URL）
   - ✅ 验收步骤（可操作）
   - ✅ 若有 SQL/migration：提供执行方式

---

## 3) 数据模型（MVP 字段）

### 3.1 freight_lead（线索）
- source：TOOL_LCL/TOOL_FCL/TOOL_SENSITIVE/WEB_FORM
- contactType：WECHAT/PHONE/EMAIL/WHATSAPP
- shipMode：SEA_LCL/SEA_FCL/AIR/EXPRESS
- cargoType：GENERAL/BATTERY/MAGNET/LIQUID/POWDER
- status：NEW/CONTACTED/QUOTED/WON/LOST

### 3.2 freight_lead_activity（跟进）
- type：CALL/WECHAT/EMAIL/NOTE

### 3.3 freight_quote（报价）+ freight_quote_item（费用项）
- currency：USD/CNY
- unit：CBM/CONTAINER/SHIPMENT

### 3.4 freight_rule_config（规则配置）
- configKey 唯一
- configValue 为 json/text
- enabled 0/1

---

# 4) Codex 执行顺序（强烈建议按顺序）

> ✅ 重要原则：**先后端（表+接口）→ 再 PC 管理端 → 再 门户 → 再移动端**  
> 原因：PC/门户/移动端都依赖后端接口，后端先稳，前端联调更顺。

---

## Sprint 1 — 线索闭环（门户留资 → 管理端可见）

### T1.1 后端：新增 ApiConstants（支持多前缀）
**仓库**：ruoyi-vue-pro  
**范围**：新增或复用常量类（不要重复造轮子）

**Codex Prompt**
- 实现一个 ApiConstants 常量类（或在现有常量类中扩展）：
  - ADMIN_API_PREFIX = "/admin-api"
  - APP_API_PREFIX   = "/app-api"
  - WEB_API_PREFIX   = "/web-api"
- 确保不影响现有 `/admin-api` 路由。

**验收**
- 项目编译通过
- 现有接口不受影响

---

### T1.2 后端：创建 freight_lead 表 + DO/Mapper/VO/Convert/Service
**仓库**：ruoyi-vue-pro  
**范围**：freight 模块新增（DO/Mapper/Service/VO/Convert/Enums）

**Codex Prompt**
- 新增 freight_lead 线索模块（MVP）：
  1) 提供 MySQL DDL（含索引：idx_status/idx_contact/idx_create_time）
  2) DO/Mapper 分页查询
  3) 枚举：ShipModeEnum/CargoTypeEnum/LeadStatusEnum/LeadSourceEnum
  4) VO：
     - WebFreightLeadCreateReqVO
     - AdminFreightLeadPageReqVO / AdminFreightLeadRespVO
     - AdminFreightLeadUpdateReqVO
  5) Convert（按项目惯例）
  6) Service：createLead(web), getLeadPage, updateLead, getLead

**验收**
- DDL 可执行
- 启动无报错
- 分页查询可用

---

### T1.3 后端：web-api 留资接口（匿名） + 最小防刷
**仓库**：ruoyi-vue-pro  
**范围**：controller/web + security 白名单

**Codex Prompt**
- 实现 `POST /web-api/freight/lead/create`  
- 匿名可访问（加入白名单）
- 最小防刷（二选一，优先简单可落地）：
  - A) IP + contactValue 60 秒重复拦截（内存缓存/redis）
  - 或 B) contactValue 10 分钟最多 3 次
- 命中防刷返回错误码（建议 42901）+ 明确提示

**验收**
- Swagger 可调通
- 匿名提交成功
- 连续提交可被拦截

---

### T1.4 后端：admin-api 线索分页/详情/更新 + 权限点
**仓库**：ruoyi-vue-pro  
**权限点**
- freight:lead:query
- freight:lead:update

**接口**
- `GET  /admin-api/freight/lead/page`
- `GET  /admin-api/freight/lead/get?id=`
- `PUT  /admin-api/freight/lead/update`

**验收**
- 登录后可调用
- 未授权被拒绝

---

### T1.5 PC 管理端：线索列表页（联调 admin-api）
**仓库**：yudao-ui-admin-vben  
**页面**
- /freight/leads （列表）
- /freight/leads/:id （详情占位）

**验收**
- 能看到 portal 提交的线索
- 分页/筛选可用

---

### T1.6 门户：/get-plan 留资页（联调 web-api）
**仓库**：logistics-tool-portal（Vue3）  
**验收**
- 提交成功返回 leadId
- 后台可见该 lead
- 支持工具页带参自动填充

---

## Sprint 2 — 跟进记录（销售工作台）

### T2.1 后端：freight_lead_activity 表 + admin/app API
**仓库**：ruoyi-vue-pro  
**权限点（admin）**
- freight:lead-activity:query
- freight:lead-activity:create

**接口**
- admin:
  - `GET  /admin-api/freight/lead-activity/list?leadId=`
  - `POST /admin-api/freight/lead-activity/create`
- app:
  - `POST /app-api/freight/lead-activity/create`

**验收**
- 能新增跟进
- PC 可查列表
- app-api 可调用

---

### T2.2 PC 管理端：线索详情页 + 跟进时间线
**仓库**：yudao-ui-admin-vben  
**验收**
- 时间线展示跟进
- 支持新增跟进、改状态

---

### T2.3 移动端：线索详情 + 快速新增跟进
**仓库**：yudao-ui-admin-uniapp  
**验收**
- 手机新增跟进，PC 可见
- contactValue 一键复制

---

## Sprint 3 — 报价与导出（先可发送，后升级 PDF）

### T3.1 后端：报价表 + CRUD（admin-api）
**仓库**：ruoyi-vue-pro  
**权限点**
- freight:quote:create
- freight:quote:query

**接口**
- `POST /admin-api/freight/quote/create`
- `GET  /admin-api/freight/quote/get?id=`
- `GET  /admin-api/freight/quote/list-by-lead?leadId=`

**验收**
- 能创建报价并查询
- total 计算正确

---

### T3.2 PC 管理端：报价编辑器 + 预览页（打印）
**仓库**：yudao-ui-admin-vben  
**验收**
- 费用项增删、合计正确
- 预览页 window.print() 可另存为 PDF

---

## Sprint 4 — 工具页（引流与转化）

### T4.1 后端：web-api 工具计算接口（rule_config 可覆盖）
**仓库**：ruoyi-vue-pro  
**接口**
- `POST /web-api/freight/tool/lcl/calc`
- `POST /web-api/freight/tool/fcl/calc`
- `POST /web-api/freight/tool/sensitive/check`

**验收**
- 匿名可调用
- 返回结构稳定（costBreakdown/total/notes）

---

### T4.2 门户：三工具页 + CTA 带入留资
**仓库**：logistics-tool-portal  
**验收**
- 工具结果展示
- CTA 跳 /get-plan 自动填充

---

## Sprint 5 — 个人入口（名片页与全站 CTA）

### T5.1 门户：/me 名片页 + 悬浮 CTA
**仓库**：logistics-tool-portal  
**验收**
- /me 可访问
- CTA 可跳转 /get-plan

---

# 5) 每次任务完成必须输出（Codex 交付格式）
- 改动文件列表
- 新增/修改的环境变量（如有）
- 本地启动与验证步骤（命令 + URL）
- Swagger / 页面验收路径（具体 URL）
- SQL/migration 执行方式
