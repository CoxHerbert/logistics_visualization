# Freight Yudao Codex Pack

本压缩包是给 mono-repo（同仓库多工程）准备的 Codex 执行包。

## 你仓库结构

- ruoyi-vue-pro/（后端）
- logistics-tool-portal/（门户）
- yudao-ui-admin-vben/（PC 管理端）
- yudao-ui-admin-uniapp/（移动端）

## 文档清单

- docs/CODEX_PROMPTS.md：每个任务的“可复制 Codex Prompt”，已写死子目录范围，避免越界修改
- docs/CODEX_TASKS.md：任务拆分 + Sprint 执行顺序
- docs/API_CONTRACT.md：接口契约（示例 JSON）
- docs/DB_DDL.sql：建表 SQL
- docs/CODEX_EXECUTION_GUIDE.md：Codex 执行教程

## 推荐执行顺序

先后端（T1.1~T1.4）→ 再 PC（T1.5）→ 再 门户（T1.6）→ 再跟进/报价/工具/名片页
