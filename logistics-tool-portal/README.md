# logistics-tool-portal

国际货运代理工具门户（Vue 3 + Ant Design Vue）。

## 已集成模块

- 路由：`vue-router`
- 状态管理：`pinia`
- API 请求：`axios`（含基础拦截器）
- 样式方案：`SCSS`

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 环境变量

项目支持按环境拆分配置：

- `.env.development`
- `.env.production`

示例：

```bash
VITE_PORTAL_API_PREFIX=/portal-api
VITE_PROXY_API_TARGET=http://localhost:48080/portal-api
```

## 本地代理

开发环境默认代理：

- `/portal-api/*` -> `VITE_PROXY_API_TARGET`（默认 `http://localhost:48080/portal-api`）
