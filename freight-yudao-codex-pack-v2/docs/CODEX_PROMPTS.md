# CODEX_PROMPTS.md — Mono-repo 版（可直接复制给 Codex）

> 你的仓库结构（同一 Git 仓库内多个工程）：
> - `ruoyi-vue-pro/`（后端，MySQL，单体）
> - `logistics-tool-portal/`（门户，Vue3，走 /portal-api）
> - `yudao-ui-admin-vben/`（PC 管理端，走 /admin-api）
> - `yudao-ui-admin-uniapp/`（移动端，走 /app-api）
>
> 约定前缀：
> - 管理端：`/admin-api`
> - 移动端：`/app-api`
> - 门户：`/portal-api`

---

## 0) 使用方法（你怎么喂给 Codex）

每次只发 **一个任务块**（例如 T1.1），让 Codex：
1) 只改指定目录（我已在每个 Prompt 写死）
2) 做完输出：改动文件列表 + 如何启动 + 验收步骤
3) 你本地跑一次（Swagger/页面），再继续下一个任务

---

## 1) 通用“硬约束”前缀（建议每次都带上）

> 你可以把这段放在每个任务前面，防止 Codex 越界改别的工程。

```text
你在一个 mono-repo 中工作，目录如下：
- ruoyi-vue-pro/（后端）
- logistics-tool-portal/（门户）
- yudao-ui-admin-vben/（PC 管理端）
- yudao-ui-admin-uniapp/（移动端）

本任务只允许改动：【<TASK_SCOPE>】（禁止改动其他目录）
要求遵循各工程既有代码风格、分层与统一响应体/请求封装方式。
完成后必须输出：
- 改动文件列表（含路径）
- 本地启动命令与联调步骤（URL/Swagger/页面）
- 验收步骤（成功 + 失败各至少 1 条）
```

---

# Sprint 1 — 线索闭环（门户留资 → 管理端可见）

## T1.1（后端）ApiConstants：支持 /admin-api /portal-api /app-api
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：新增（或复用）一个 API 前缀常量类，统一管理：
- ADMIN_API_PREFIX = "/admin-api"
- WEB_API_PREFIX   = "/portal-api"
- APP_API_PREFIX   = "/app-api"

约束：
1) 如项目已有类似常量类/接口前缀常量，必须复用并扩展，不得重复创建同名功能类
2) 不得影响既有 /admin-api 路由
3) 输出你新增/修改的文件清单

验收：
- 后端编译通过
- 任意现有 /admin-api 接口仍可访问（给出一个你选择的接口路径作为验证）
交付：
- 改动文件列表
- 如何验证不影响现有接口
```

---

## T1.2（后端）Lead：建表 + DO/Mapper/Service/VO/Enums/Convert
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：新增 freight_lead 线索模块（MVP），支持门户留资与管理端分页查询。

需求：
1) 提供 MySQL DDL 创建表 freight_lead（含索引 idx_status/idx_contact/idx_create_time）
2) 按项目现有代码风格新增：
   - DO：FreightLeadDO（或项目命名习惯）
   - Mapper：分页查询 + 按 id 查询 + 更新
   - Service：createLeadWeb / getLeadPage / getLead / updateLead
3) 新增枚举：
   - ShipModeEnum：SEA_LCL/SEA_FCL/AIR/EXPRESS
   - CargoTypeEnum：GENERAL/BATTERY/MAGNET/LIQUID/POWDER
   - LeadStatusEnum：NEW/CONTACTED/QUOTED/WON/LOST
   - LeadSourceEnum：TOOL_LCL/TOOL_FCL/TOOL_SENSITIVE/WEB_FORM
4) 新增 VO（按项目 VO 目录规则）：
   - WebFreightLeadCreateReqVO
   - AdminFreightLeadPageReqVO
   - AdminFreightLeadRespVO
   - AdminFreightLeadUpdateReqVO（至少支持 status/remark 更新）
5) Convert：如果项目使用 MapStruct 则新增对应 Convert；否则按项目惯例手写转换

约束：
- VO 使用 javax validation（@NotBlank/@NotNull 等）
- 接口返回结构必须沿用项目统一响应体（不要自创新结构）
- 字段命名必须与项目基类字段一致（createTime/updateTime/deleted 等按项目现状对齐）

验收：
- DDL 可在 MySQL 执行成功
- 启动后无报错
- 通过一个最小自测（例如在 service 中插入一条再分页查询）或提供可用的 Mapper/Service 调用方式

交付：
- 1) DDL（放到 docs 或 resources 下，说明如何执行）
- 2) 改动文件列表
- 3) 启动与简单自测步骤
```

---

## T1.3（后端）web-api 留资 create + 匿名放行 + 防刷
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：实现门户留资接口（web-api）+ 安全放行 + 最小防刷。

接口：
- POST /portal-api/freight/lead/create
入参：WebFreightLeadCreateReqVO（包含 contactType/contactValue/shipMode/cargoType/weightKg/volumeCbm/cartons/originPort/destination/incoterms/fba/amazonWarehouseCode/expectation/remark）
出参：leadId（使用项目统一响应体包装）

安全：
1) /portal-api/freight/lead/create 必须允许匿名访问（加入白名单）
2) 实现最小防刷（优先简单可落地）：
   - A) IP + contactValue 60 秒内重复提交拦截
   或
   - B) contactValue 10 分钟内最多 3 次
3) 命中防刷返回错误码（建议 42901，若项目有统一错误码体系则按其规范）与提示“提交过于频繁，请稍后再试”

约束：
- 不能影响 /admin-api 既有鉴权逻辑
- 不要引入复杂验证码/滑块（MVP 先不要）
- 若项目已有 redis/缓存工具，优先复用；否则可用本地缓存（说明局限）

验收：
- Swagger 调用 POST /portal-api/freight/lead/create 成功返回 leadId
- 60 秒内重复提交同一 contactValue 会被拦截（提供命中示例）

交付：
- 改动文件列表
- Swagger 调用步骤（包含 request 示例）
```

---

## T1.4（后端）admin-api：lead page/get/update + 权限点
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：提供管理端线索工作台接口（admin-api），包含权限点。

接口：
1) GET  /admin-api/freight/lead/page
   - 支持分页参数（pageNo/pageSize）与筛选：status/contactValue/originPort/destination/createTimeStart/createTimeEnd（按项目惯例）
2) GET  /admin-api/freight/lead/get?id=
3) PUT  /admin-api/freight/lead/update
   - 至少支持更新 status/remark（可扩展）

权限点（必须加 @PreAuthorize）：
- freight:lead:query
- freight:lead:update

约束：
- 返回结构必须沿用项目统一响应体 + 分页结构（PageResult 等）
- Swagger 注解齐全
- 若项目菜单/权限资源需要初始化（SQL 或配置），请输出建议（至少列出权限字符串）

验收：
- 登录后可访问以上接口
- 无权限时返回 403（或项目统一的无权限响应）

交付：
- 改动文件列表
- Swagger 验证步骤（至少 1 个成功 + 1 个失败）
```

---

## T1.5（PC）vben：leads 列表 + 详情占位（联调 /admin-api）
**TASK_SCOPE**：`yudao-ui-admin-vben/**`

```text
你在一个 mono-repo 中工作（只允许改 yudao-ui-admin-vben/**）。

目标：新增货代线索模块最小可用页面，并联调后端 /admin-api。

页面与路由：
- /freight/leads        LeadsList.vue
- /freight/leads/:id    LeadDetail.vue（先占位，但要能打开）

功能：
1) LeadsList.vue：
   - 表格分页（对接 GET /admin-api/freight/lead/page）
   - 筛选：status、contactValue、originPort、destination
   - 列：id、contactType/contactValue、shipMode、cargoType、volumeCbm、weightKg、status、createTime
   - 点击某行跳转详情页
2) API 封装：
   - 新增 freightLeadApi.ts（或按项目既有 api 文件组织）

约束：
- 必须复用项目现有请求封装（axios/request），不要自写 fetch
- 与项目 UI 风格一致（组件库/样式按项目现状）
- 错误提示使用项目现有 message/toast 方案

验收：
- 页面可打开
- 能看到后端通过 web-api 提交的 lead
- 分页与筛选可用

交付：
- 改动文件列表
- 如何启动与验证（URL）
```

---

## T1.6（门户）/get-plan 留资页（联调 /portal-api）
**TASK_SCOPE**：`logistics-tool-portal/**`

```text
你在一个 mono-repo 中工作（只允许改 logistics-tool-portal/**）。

目标：新增门户留资页 /get-plan，调用 POST /portal-api/freight/lead/create。

页面：
- /get-plan

表单字段：
- contactType/contactValue（必填）
- shipMode/cargoType（必填）
- volumeCbm/weightKg/cartons（至少填其一；要写校验）
- originPort/destination/incoterms（可选）
- fba（true 时校验 amazonWarehouseCode）
- expectation（FAST/STABLE/CHEAP）
- remark（可选）

带参填充：
- 支持从 query 或 localStorage 读入默认值（shipMode/cargoType/volumeCbm/weightKg/originPort/destination）

提交成功页：
- 展示 leadId
- 展示“初版方案摘要”（把用户输入拼成可读文本）
- 提供个人入口：跳转 /me 或复制微信号（先写死占位）

约束：
- API base 使用 /portal-api（开发期可走代理）
- 使用项目现有 UI/表单方案（不要引入新库）
- 错误提示友好

验收：
- 可提交成功并拿到 leadId
- 后端 admin-api 列表能看到该 lead

交付：
- 改动文件列表
- 如何启动与验证（URL + 操作步骤）
```

---

# Sprint 2 — 跟进记录

## T2.1（后端）Activity：建表 + admin/app API
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：实现线索跟进记录模块 freight_lead_activity。

需求：
1) MySQL DDL：freight_lead_activity（含 lead_id 外键）
2) admin-api：
   - GET  /admin-api/freight/lead-activity/list?leadId=
   - POST /admin-api/freight/lead-activity/create
   权限点：
   - freight:lead-activity:query
   - freight:lead-activity:create
3) app-api：
   - POST /app-api/freight/lead-activity/create（移动端快速记录；要求登录策略）

约束：
- 复用统一响应体
- VO 校验完整
- 不影响既有安全配置

验收：
- 新增跟进成功
- admin list 可查
- app create 可调通

交付：
- 改动文件列表
- Swagger 验证步骤
```

---

## T2.2（PC）LeadDetail：时间线 + 新增跟进 + 改状态
**TASK_SCOPE**：`yudao-ui-admin-vben/**`

```text
你在一个 mono-repo 中工作（只允许改 yudao-ui-admin-vben/**）。

目标：完善 LeadDetail.vue：
1) 顶部展示 lead 基础信息（GET /admin-api/freight/lead/get）
2) 跟进时间线（GET /admin-api/freight/lead-activity/list）
3) 新增跟进弹窗（POST /admin-api/freight/lead-activity/create）
4) 状态修改（PUT /admin-api/freight/lead/update）

约束：
- 复用项目组件/请求封装
- 交互使用项目 message/toast

验收：
- 新增跟进后时间线立即刷新
- 状态修改后列表页同步（至少刷新后正确）

交付：
- 改动文件列表
- 验证路径
```

---

## T2.3（移动端）快速跟进（先最小闭环）
**TASK_SCOPE**：`yudao-ui-admin-uniapp/**`

```text
你在一个 mono-repo 中工作（只允许改 yudao-ui-admin-uniapp/**）。

目标：移动端支持查看线索并新增跟进（最小）。

页面：
- 线索列表（可先复用 admin-api page 或新建 app-api list）
- 线索详情（展示 contactValue、货物信息）
- 快速新增跟进（POST /app-api/freight/lead-activity/create）

要求：
- contactValue 一键复制
- 提交跟进后提示成功

验收：
- 手机新增跟进，PC 时间线可见

交付：
- 改动文件列表
- 启动与验证步骤
```

---

# Sprint 3 — 报价与打印（MVP）

## T3.1（后端）Quote：建表 + CRUD（admin-api）
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：实现报价模块 freight_quote + freight_quote_item（admin-api）。

需求：
1) MySQL DDL：freight_quote、freight_quote_item（含外键）
2) admin-api：
   - POST /admin-api/freight/quote/create（含 items）
   - GET  /admin-api/freight/quote/get?id=
   - GET  /admin-api/freight/quote/list-by-lead?leadId=
   权限点：
   - freight:quote:create
   - freight:quote:query
3) create 时自动计算 total（sum(items.amount)；amount=qty*unitPrice）

约束：
- 统一响应体
- VO 校验
- item 支持排序字段 sort

验收：
- 创建报价成功
- total 正确
- get 返回包含 items

交付：
- 改动文件列表
- Swagger 调用步骤
```

---

## T3.2（PC）报价编辑器 + 预览打印（window.print）
**TASK_SCOPE**：`yudao-ui-admin-vben/**`

```text
你在一个 mono-repo 中工作（只允许改 yudao-ui-admin-vben/**）。

目标：实现报价编辑与预览打印（MVP 可发给客户）。

功能：
1) 在 LeadDetail 加“新建报价”入口：
   - 编辑 items（增删行、qty/unitPrice、自动 amount、自动 total）
   - 保存调用 POST /admin-api/freight/quote/create
2) 报价预览页：
   - A4 友好布局（固定宽度，适合打印）
   - 打印按钮：window.print()（浏览器另存 PDF）
   - 展示你的联系信息（先写死在页面常量，后续可从 rule_config 读取）

验收：
- 能创建报价
- 预览页可打印并另存为 PDF

交付：
- 改动文件列表
- 验证步骤
```

---

# Sprint 4 — 工具接口 + 门户工具页

## T4.1（后端）web-api 工具接口（默认规则 + rule_config 可覆盖）
**TASK_SCOPE**：`ruoyi-vue-pro/**`

```text
你在一个 mono-repo 中工作（只允许改 ruoyi-vue-pro/**）。

目标：实现门户三工具接口（匿名），并支持从 freight_rule_config 覆盖默认规则。

接口：
- POST /portal-api/freight/tool/lcl/calc
- POST /portal-api/freight/tool/fcl/calc
- POST /portal-api/freight/tool/sensitive/check

返回结构统一：
- costBreakdown[]：{name, unit, qty, unitPrice, amount, note}
- total
- currency
- notes[]（风险提示/资料清单）

约束：
- 默认规则写在代码中（MVP）
- 如果 rule_config 中存在同 key 且 enabled=1，则覆盖默认值
- 匿名可访问（安全放行）
- 不要依赖外部实时运价（先工具参考价）

验收：
- Swagger 匿名可调用
- 返回结构稳定

交付：
- 改动文件列表
- Swagger 调用示例
```

---

## T4.2（门户）三工具页 + CTA 带参到 /get-plan
**TASK_SCOPE**：`logistics-tool-portal/**`

```text
你在一个 mono-repo 中工作（只允许改 logistics-tool-portal/**）。

目标：新增门户工具页并联调后端 web-api。

页面：
- /tools/sea-lcl  调用 POST /portal-api/freight/tool/lcl/calc
- /tools/sea-fcl  调用 POST /portal-api/freight/tool/fcl/calc
- /tools/sensitive-check 调用 POST /portal-api/freight/tool/sensitive/check

要求：
- 输入表单 + 结果展示（费用拆解/total/notes）
- CTA 按钮：“获取出货方案” → 跳转 /get-plan 并带入参数（query 或 localStorage）

验收：
- 工具可计算
- CTA 自动填充 /get-plan

交付：
- 改动文件列表
- 验证路径
```

---

# Sprint 5 — 名片页与全站 CTA

## T5.1（门户）/me 名片页 + 悬浮 CTA
**TASK_SCOPE**：`logistics-tool-portal/**`

```text
你在一个 mono-repo 中工作（只允许改 logistics-tool-portal/**）。

目标：实现个人入口，让工具门户自然转化为“联系我”。

页面：
- /me 名片页（定位、擅长线路、服务承诺、联系信息：微信号可复制 + 二维码占位）

全站组件：
- 悬浮按钮“获取出货方案”跳转 /get-plan
- 工具结果页底部也放 CTA

验收：
- /me 可访问
- CTA 可用

交付：
- 改动文件列表
- 验证步骤
```

---

## 附：你可以直接把任务发给 Codex 的顺序
1) T1.1 → T1.2 → T1.3 → T1.4（后端）
2) T1.5（PC）
3) T1.6（门户）
4) T2.1（后端）→ T2.2（PC）→ T2.3（移动）
5) T3.1（后端）→ T3.2（PC）
6) T4.1（后端）→ T4.2（门户）
7) T5.1（门户）
