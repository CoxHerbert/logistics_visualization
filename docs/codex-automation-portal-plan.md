# 国际货运系统（含门户）Codex 自动化执行方案

> 目标：在现有芋道三端基础上，通过 Codex 分阶段自动化推进“后台管理端 + 用户门户端 + 移动端”的建设。

## 1. 当前基座与职责划分

- 后端基座：`ruoyi-vue-pro`（Spring Boot 多模块）
- 后台管理端：`yudao-ui-admin-vue3`
- 用户门户/移动端基座：`yudao-ui-admin-uniapp`（可发布 H5 / 小程序 / App）

建议将「门户」定义为 **H5 用户端 + PC Web 门户（可选）**：

- 第一阶段先在 uniapp 的 H5 端交付门户能力（登录、询价、下单、轨迹、账单）
- 第二阶段再按品牌诉求补 PC 门户（可复用 Vue3 技术栈）

---

## 2. Codex 自动化执行总原则

1. **一阶段一目标**：每次只让 Codex 完成一个里程碑（例如“报价单 CRUD + 前端页面 + API 对接”）
2. **一任务一验收**：每个任务都给出“可执行验收命令”
3. **固定输出格式**：强制 Codex 输出 `Summary / Changed Files / Testing / Risks`
4. **始终可回滚**：任务结束必须 commit，避免大任务堆在一个提交里

---

## 3. 推荐目录（新增）

```text
.codex/
  prompts/
    01-domain-model.prompt.md
    02-backend-crud.prompt.md
    03-admin-pages.prompt.md
    04-portal-pages.prompt.md
    05-integration-test.prompt.md
  tasks/
    roadmap.yaml
    sprint-1.yaml
    sprint-2.yaml
```

说明：
- `prompts/` 保存可重复使用的“标准指令模板”
- `tasks/` 保存里程碑任务清单（便于按批次喂给 Codex）

---

## 4. 可直接执行的里程碑（门户优先）

### M1：物流领域模型落地（后端）

范围：
- 新增核心实体：`customer`、`quote`、`shipment_order`、`shipment_track`、`settlement_bill`
- 输出 SQL 与后端 CRUD（Controller / Service / Mapper）

验收：
- 能成功编译
- 关键接口可通过 Swagger 访问

### M2：后台管理端（运营/客服/财务）

范围：
- 报价管理、订单管理、轨迹管理、账单管理页面
- 菜单、权限点、字典项初始化

验收：
- 页面可访问，列表/查询/新增/编辑/导出可用

### M3：用户门户（H5）

范围：
- 门户首页（品牌 + 服务入口）
- 在线询价
- 我的订单（进度时间线）
- 我的账单

验收：
- 用户可从登录进入门户，完成“询价 -> 下单 -> 查看轨迹”闭环

### M4：流程与通知（可选）

范围：
- 引入审批流：大额报价审批、异常签批
- 站内信/短信通知：节点变更推送

验收：
- 审批状态影响订单状态流转

---

## 5. 你可以直接复制给 Codex 的执行指令模板

> 每次只贴一个模板，避免上下文过大。

### 模板 A：后端实体 + CRUD

```text
你是资深 Java 架构师。
请在 ruoyi-vue-pro 中实现国际货运报价单 quote 的完整 CRUD：
1) 新增数据库表与索引（MySQL）
2) 新增 DO/VO/Mapper/Service/Controller
3) 对接现有代码风格与包路径
4) 补齐后端单元测试（至少 Service 层）
5) 运行并汇报可执行的验证命令
输出要求：
- 仅修改与 quote 相关文件
- 最后给出变更文件清单 + 风险点 + 下一步建议
```

### 模板 B：后台管理端页面

```text
请在 yudao-ui-admin-vue3 中新增“报价管理”菜单页面：
1) 列表页：按报价单号/客户名/状态筛选
2) 表单页：新增/编辑报价单
3) API：对接 /admin-api/logistics/quote
4) 权限：新增 logistics:quote:* 权限点
5) 执行 pnpm lint:eslint 与 pnpm ts:check
输出要求：
- 给出页面路由与菜单绑定点
- 给出测试命令与结果
```

### 模板 C：门户（H5）页面

```text
请在 yudao-ui-admin-uniapp 中实现门户端“我的运单”页面：
1) 列表：按状态筛选（待订舱/在途/已签收）
2) 详情：展示物流时间线
3) 接口：对接 /app-api/logistics/order/*
4) 增加未登录拦截，跳转登录页
5) 本地运行并给出 dev:h5 验证步骤
输出要求：
- 文件清单 + 运行命令 + 已知限制
```

---

## 6. 门户信息架构（建议首版）

- 门户首页
  - Banner（国际海运/空运服务）
  - 快捷入口：在线询价、我要发货、运单查询、账单中心
- 在线询价
  - 起运港、目的港、运输方式、货量、时效要求
- 订单中心
  - 全部订单、待处理、运输中、已完成
- 运单详情
  - 基本信息 + 节点轨迹 + 费用信息 + 单证下载
- 账户中心
  - 企业资料、联系人、发票信息

---

## 7. 自动化看板（建议）

在 `tasks/roadmap.yaml` 维护任务状态：

```yaml
project: logistics-portal
milestones:
  - id: M1
    name: backend-domain
    status: todo
    done_definition:
      - quote/order/track/bill CRUD 可用
      - 核心接口通过联调
  - id: M2
    name: admin-console
    status: todo
    done_definition:
      - 后台四大页面可用
  - id: M3
    name: user-portal-h5
    status: todo
    done_definition:
      - 询价-下单-轨迹闭环
```

---

## 8. 交付节奏（8 周示例）

- 第 1-2 周：M1 数据模型 + 后端接口
- 第 3-4 周：M2 后台管理端
- 第 5-6 周：M3 门户 H5
- 第 7 周：联调 + 性能优化
- 第 8 周：UAT + 上线

---

## 9. 风险与规避

- 风险：一次让 Codex 改动过大，容易破坏既有结构
  - 规避：拆成小任务 + 每任务独立 commit
- 风险：前后端接口命名不一致
  - 规避：先冻结 OpenAPI/接口约定，再让 Codex 写页面
- 风险：门户端权限与后台权限混用
  - 规避：明确 `/admin-api` 与 `/app-api` 边界

---

## 10. 你现在就可以执行的最小闭环

1. 先让 Codex 完成 M1 的 `quote` 单模块
2. 再让 Codex 完成后台“报价管理”页面
3. 最后让 Codex 在门户端做“在线询价 + 我的报价”

当这三步跑通后，再复制同样模式扩展到订单、轨迹和账单。
