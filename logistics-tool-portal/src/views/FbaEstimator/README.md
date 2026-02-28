# 用户端 FBA 成本预估/询价页（Vue3 + Ant Design Vue）

## 目标

用户端只填“我知道的”：明细体积/重量/品名 + 选择拼箱/整柜/海派。
页面提供两个入口：

- **快速预估**：少字段，10秒得到“价格区间 + 时效区间”，引导留资
- **精准报价**：支持多箱型明细（不同规格箱子），给更精确区间，并提交线索

## 目录

- `FbaEstimator.vue`：页面入口（建议挂到 /tools/fba-estimator）
- `components/CartonCardList.vue`：箱型卡片列表（不拥挤）
- `components/EstimateResult.vue`：结果卡片（价格区间/时效区间/包含项）
- `pricing.ts`：示例费率与估算逻辑（你后续可替换为后端接口）
- `schema.ts`：字段 schema（方便后续接表单生成/后端校验）

## 快速接入（以 logistics-tool-portal 为例）

1. 把整个目录拷贝到你的项目（如 `src/views/tools/fba/`）
2. 在 router 增加路由：
    - path: `/tools/fba-estimator`
    - component: `FbaEstimator.vue`
3. 菜单加入口即可。

> 说明：当前是“纯前端示例”，费率在 `pricing.ts`。你后续可：
>
> - 把费率/模板放到 yudao 后端（portal-api），页面改为 fetch
> - 或提交线索后由销售回填精准报价
