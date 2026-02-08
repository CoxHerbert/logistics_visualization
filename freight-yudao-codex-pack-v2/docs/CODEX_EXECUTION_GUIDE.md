# CODEX_EXECUTION_GUIDE.md — 如何让 Codex 执行（含顺序）

这份指南的目标：让你把任务 **“拆成 Codex 一条条能做的 PR”**，并且每条都能验收、可回滚、可迭代。

> 你当前工程：
> - 后端：ruoyi-vue-pro（MySQL，单体）
> - 门户：logistics-tool-portal（Vue3，走 /web-api）
> - PC 管理端：yudao-ui-admin-vben（走 /admin-api）
> - 移动端：yudao-ui-admin-uniapp（走 /app-api）

---

## 1) Codex 最佳实践（非常重要）

### 1.1 一次只做一个“小任务”
不要让 Codex “一次把所有功能都写完”。正确方式：
- 一个任务 = 一个 PR
- PR 中只改“指定范围”的文件
- PR 有明确验收路径（Swagger/页面 URL + 操作步骤）

### 1.2 每个任务都要给 Codex 这 6 个要素
1) 仓库名（明确在哪个 repo）
2) 目标（要实现什么）
3) 文件范围（只允许改哪些目录）
4) 约束（必须遵循项目惯例、权限、安全、响应体）
5) 验收步骤（你要怎么点、怎么调用接口）
6) 输出要求（改动文件列表、运行命令、注意事项）

### 1.3 每次完成后“你要做的事”
- 本地启动/联调（至少跑一次）
- 过一遍关键路径（Swagger / 页面）
- 确认无破坏（特别是 /admin-api 既有接口）

---

## 2) 推荐执行顺序（按依赖关系排序）

> ✅ 必须按下面顺序做：**后端 → PC 管理端 → 门户 → 移动端 → 报价 → 工具**

### Phase A（先跑通线索闭环）
1) ruoyi-vue-pro：T1.1 ApiConstants（多前缀）
2) ruoyi-vue-pro：T1.2 freight_lead 表 + Service
3) ruoyi-vue-pro：T1.3 web-api 留资 create + 防刷 + 白名单
4) ruoyi-vue-pro：T1.4 admin-api lead page/get/update + 权限点
5) yudao-ui-admin-vben：T1.5 leads 列表/详情占位联调
6) logistics-tool-portal：T1.6 /get-plan 留资联调

### Phase B（让你能像销售一样工作）
7) ruoyi-vue-pro：T2.1 activity 表 + admin/app API
8) yudao-ui-admin-vben：T2.2 线索详情时间线 + 新增跟进
9) yudao-ui-admin-uniapp：T2.3 手机快速跟进

### Phase C（报价与可发给客户的报价单）
10) ruoyi-vue-pro：T3.1 quote/quote_item 表 + CRUD
11) yudao-ui-admin-vben：T3.2 报价编辑器 + 预览打印（MVP）

### Phase D（工具引流）
12) ruoyi-vue-pro：T4.1 web-api 三工具接口（规则可覆盖）
13) logistics-tool-portal：T4.2 三工具页 + CTA 带入留资
14) logistics-tool-portal：T5.1 /me 名片页 + 悬浮 CTA

---

## 3) 可直接复制的 Codex Prompt 模板

> 你每次给 Codex 发任务，都用下面模板，把【方括号】替换成具体内容。

```text
仓库：[ruoyi-vue-pro / yudao-ui-admin-vben / logistics-tool-portal / yudao-ui-admin-uniapp]

目标：实现【任务标题】
范围：只允许改动以下目录/文件：
- 【列出允许改动的路径】

约束：
1) 必须遵循项目现有代码风格/分层（不要自创新结构）
2) 接口返回必须使用项目现有统一响应体
3) admin-api 必须包含权限点与 @PreAuthorize；web-api 匿名 + 最小防刷；app-api 需要登录策略
4) VO/表单必须有校验；错误提示要明确
5) 不要引入不必要的新依赖；如必须引入，写清楚原因与替代方案

验收：
- 【具体 Swagger URL、接口、请求样例、或页面路径】
- 【成功与失败场景各至少一个】

交付格式：
- 改动文件列表（含路径）
- 本地启动命令与联调步骤
- 注意事项（如 SQL 执行、环境变量等）
```

---

## 4) 示例：把 T1.3 直接发给 Codex（可复制）

```text
仓库：ruoyi-vue-pro
目标：实现门户留资接口 + 匿名放行 + 防刷
范围：只允许改动 freight lead 模块相关目录 + 安全白名单配置
约束：
- Controller 路由前缀必须是 /web-api
- 返回结构必须使用项目统一响应体
- 防刷命中返回错误码 42901（或项目已有约定），提示“提交过于频繁”
验收：
1) Swagger 调用 POST /web-api/freight/lead/create 成功返回 leadId
2) 60 秒内重复提交同一 contactValue 会被拦截
交付：
- 改动文件列表
- 本地启动与 Swagger 验证步骤
```

---

## 5) 常见坑（提前规避）

1) **重复造轮子**：项目已有 PageResult/CommonResult/分页组件/枚举字典时，必须复用
2) **字段命名不一致**：表字段、DO、VO 的命名要按项目惯例统一（特别是 createTime/updateTime/deleted）
3) **权限点没接上**：接口有 @PreAuthorize，但菜单/权限资源没配置，会导致前端看不到或 403
4) **web-api 忘记放行**：门户提交直接 401/403
5) **防刷实现过重**：MVP 先做简单拦截，别做复杂验证码/滑块

---

## 6) 你拿到一个 PR 后的验收 checklist

- [ ] 后端能启动、无报错
- [ ] Swagger 可调通（成功/失败各一条）
- [ ] PC 管理端页面能联调展示
- [ ] 门户提交 lead 后后台可见
- [ ] 防刷命中有明确提示
