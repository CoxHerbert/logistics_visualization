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
VITE_API_BASE_URL=/api
VITE_WEB_API_BASE_URL=
VITE_PROXY_API_TARGET=http://localhost:48080/admin-api
VITE_PROXY_WEB_API_TARGET=http://localhost:48080
VITE_PUBLIC_BASE=/portal/
```

生产环境可通过 `VITE_PUBLIC_BASE` 配置静态资源基础路径（默认 `/portal/`）。

> 若部署到根路径，设置为 `VITE_PUBLIC_BASE=/`；若部署在二级目录，需带前后斜杠，例如 `/portal/`。

## 本地代理

开发环境默认代理：

- `/api/*` -> `VITE_PROXY_API_TARGET`（默认 `http://localhost:48080/admin-api`）
- `/web-api/*` -> `VITE_PROXY_WEB_API_TARGET`（默认 `http://localhost:48080`）

## 部署排查

如果线上出现 `assets/index-*.js` 或 `assets/index-*.css` 404：

1. 确认上传的是同一次 `npm run build` 产物（`index.html` 与 `assets/` 必须成对）。
2. 确认 Nginx/网关将 `/portal/` 正确映射到前端构建目录。
3. 若部署路径不是 `/portal/`，构建前设置正确的 `VITE_PUBLIC_BASE`。
4. 建议清理 CDN/浏览器缓存后再验证，避免旧 `index.html` 引用已删除的 hash 文件。
