# CODEx 作业指令（可直接粘贴给 Codex 执行）

> 说明：以下任务以「最少改动」为目标，尽量与你现有的芋道工程风格一致。
> 你需要把本 zip 内的文件复制到对应仓库路径，并进行少量包名/路由/权限码调整。

---

## Task 0：前置确认（自动化检测）

1. 在后端仓库中全局搜索 `class BaseDO`，打开该文件，检查是否包含字段 `tenantId`（或 `tenant_id` 对应的属性）。
   - 若包含：后续生成的 `FreightPriceDO` **不声明 tenantId**
   - 若不包含：后续生成的 `FreightPriceDO` **增加 `private Long tenantId;`**

2. 在后端仓库中确认 `yudao-module-freight-biz` 已依赖 mybatis starter（能使用 BaseMapperX/LambdaQueryWrapperX）。
   - 若缺少依赖，请补上（按你项目已有模块依赖方式）。

---

## Task 1：数据库变更

1. 执行 `sql/001_create_freight_price.sql`，创建表 `freight_price`（含 tenant_id DEFAULT 1）。
2. 若你使用 Flyway/Liquibase：将该 SQL 按你工程规范移动到 migration 目录。

---

## Task 2：后端新增代码（yudao-module-freight）

> 目标：新增 `FreightPrice` 后台 CRUD + 门户报价 calc

把本 zip 中 `backend/` 下的文件复制到你的 `yudao-module-freight` 对应目录，并根据你工程的包结构调整 package。

### 2.1 数据对象 DO & Mapper

- `backend/dal/dataobject/price/FreightPriceDO.java`
- `backend/dal/mysql/price/FreightPriceMapper.java`

注意：
- 如果 BaseDO 已含 tenantId，不要在 DO 再声明 tenantId
- 如果你是 MySQL：删除 `@KeySequence`（若模板里出现）

### 2.2 VO（后台）

- `backend/controller/admin/price/vo/*`

### 2.3 Service

- `backend/service/price/FreightPriceService.java`
- `backend/service/price/FreightPriceServiceImpl.java`

### 2.4 Controller（后台）

- `backend/controller/admin/price/FreightPriceController.java`

按你项目习惯补：
- `@PreAuthorize(...)` 权限码
- Swagger 注解（如你们要求）

### 2.5 Portal 报价计算（匿名接口）

- `backend/controller/portal/price/vo/*`
- `backend/controller/portal/price/FreightPricePortalController.java`

---

## Task 3：管理端 vben 新增页面

将 `admin-vben/` 下文件复制到你的 `yudao-ui-admin-vben` 仓库，并按你项目结构调整：

1. `admin-vben/src/api/freight/price.ts` → 复制到你的 API 目录
2. `admin-vben/src/views/freight/price/index.vue` → 复制到你的页面目录
3. 增加菜单路由（按你系统路由/菜单管理方式）：
   - 菜单：`货代管理 -> 运价管理`
   - 路由指向：`/freight/price` → `views/freight/price/index.vue`

---

## Task 4：联调与自测

1. 后端启动：访问 swagger 验证 CRUD 接口都正常
2. 管理端登录：检查页面列表/新增/编辑/启停正常
3. 门户报价：
   - 先后台新增一条运价（启用，日期有效）
   - 调用 `POST /portal-api/freight/price/calc`，检查 amount/min_price/chargeable 计算正确

---

## Task 5：可选增强（后续迭代）

- 最低计费量（如 0.5 CBM、100 KG）
- 阶梯价（按区间）
- 目的地支持：港口/仓库/邮编段
- 渠道优先级：美森/普船/快船

