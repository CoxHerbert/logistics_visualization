# FreightPrice 运价管理模块（芋道 / ruoyi-vue-pro，多租户 tenant_id=1 兜底）- Codex 作业方案

目标：在 `yudao-module-freight` 中新增 **运价维护**（后台 CRUD）与 **门户报价计算**（portal-api），并在 vben 管理端新增页面。
本方案假设你的系统为多租户，`tenant_id` **必须存在**，且你当前默认租户为 `1`（DB 默认值兜底）。

---

## 1. 交付物清单（本 zip 已包含）

- `sql/001_create_freight_price.sql`：运价表（含 `tenant_id DEFAULT 1`）
- `backend/`：后端代码骨架（DO/Mapper/VO/Service/Controller/Portal Calc）
- `admin-vben/`：管理端页面与 API 封装（列表/新增/编辑/启停）
- `CODEx_TASKS.md`：Codex 可执行作业指令（逐步任务）
- `CHECKLIST.md`：自测清单

---

## 2. 约定与接口

### 后台（admin）
- `GET  /admin-api/freight/price/page`
- `GET  /admin-api/freight/price/get?id=...`
- `POST /admin-api/freight/price/create`
- `PUT  /admin-api/freight/price/update`
- `PUT  /admin-api/freight/price/update-status?id=...&status=...`

### 门户（portal）
- `POST /portal-api/freight/price/calc`

---

## 3. 多租户 tenant_id 说明（重要）

- 表中必须有：`tenant_id BIGINT NOT NULL DEFAULT 1`
- 索引建议：`tenant_id` 放在复合索引最前面
- DO 采用 **方案 A**：继承框架 BaseDO（或 TenantBaseDO）
  - 如果 BaseDO 已包含 tenantId 字段：**不要**在 DO 重复声明
  - 如果 BaseDO 没有 tenantId：在 DO 增加 `private Long tenantId;`

> Codex 作业中包含一步「自动检测 BaseDO 是否包含 tenantId」，并据此生成最终 DO。

---

## 4. 使用方式

1) 将 zip 解压到你的工作区（与后端/前端仓库同级或任意目录）
2) 按 `CODEx_TASKS.md` 执行：复制文件到目标项目路径、补包名、补菜单路由、运行验证
3) 通过 `CHECKLIST.md` 完成自测

