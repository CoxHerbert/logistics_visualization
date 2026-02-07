# Codex 自动化执行快速启动

> 目标：让你“复制命令就能跑”，不需要先读完整方案。

## 0. 前置准备

在仓库根目录执行：

```bash
cd /workspace/logistics_visualization
```

## 1. 查看任务看板

```bash
cat .codex/tasks/roadmap.yaml
cat .codex/tasks/sprint-1.yaml
```

## 2. 选择本次要执行的任务（推荐从 S1-1 开始）

- S1-1：后端报价 CRUD
- S1-2：后台报价管理页面
- S1-3：门户在线询价页面（H5）

## 3. 使用对应 Prompt 驱动 Codex

把下面文件内容复制给 Codex（一次只执行一个）：

```bash
cat .codex/prompts/02-backend-crud.prompt.md
cat .codex/prompts/03-admin-pages.prompt.md
cat .codex/prompts/04-portal-pages.prompt.md
```

## 4. 在本地执行验收命令

### S1-1 后端
```bash
cd ruoyi-vue-pro
mvn -pl yudao-server -am test
cd ..
```

### S1-2 后台管理端
```bash
cd yudao-ui-admin-vue3
pnpm lint:eslint
pnpm ts:check
cd ..
```

### S1-3 门户（H5）
```bash
cd yudao-ui-admin-uniapp
pnpm dev:h5
```

## 5. 提交规范（每个任务一个提交）

```bash
git add <changed_files>
git commit -m "feat(logistics): <task-id> <short description>"
```

## 6. 一条命令打印“下一步该做什么”

```bash
bash .codex/scripts/start.sh
```

或指定任务：

```bash
bash .codex/scripts/start.sh S1-2
```
