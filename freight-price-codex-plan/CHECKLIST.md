# CHECKLIST 自测清单

## 数据库
- [ ] `freight_price` 表存在
- [ ] 表包含 `tenant_id` 且 NOT NULL，默认值为 1
- [ ] 复合索引以 `tenant_id` 开头

## 后端（admin）
- [ ] `/admin-api/freight/price/create` 插入成功（不报 tenant 相关错误）
- [ ] `/admin-api/freight/price/page` 可分页查询
- [ ] `/admin-api/freight/price/update` 可更新
- [ ] `/admin-api/freight/price/update-status` 可启停
- [ ] 逻辑删除字段 `deleted` 正常生效（如你项目启用）

## 后端（portal）
- [ ] `/portal-api/freight/price/calc` 匿名调用成功
- [ ] 当无匹配价格时返回 null（或你定义的错误码）
- [ ] price_mode=1（CBM）时按 volumeCbm 计费且应用 minPrice
- [ ] price_mode=2（KG）时按 weightKg 计费且应用 minPrice
- [ ] price_mode=3（一口价）时 chargeable=1

## 前端（vben）
- [ ] 运价管理列表能查到数据
- [ ] 能新增/编辑/启用停用
- [ ] 搜索条件（类型/起运/目的/状态）有效
