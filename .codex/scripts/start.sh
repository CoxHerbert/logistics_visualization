#!/usr/bin/env bash
set -euo pipefail

TASK="${1:-S1-1}"

echo "[Codex 自动化启动器]"
echo "当前建议任务: ${TASK}"
echo

echo "1) 任务看板"
echo "   cat .codex/tasks/roadmap.yaml"
echo "   cat .codex/tasks/sprint-1.yaml"
echo

case "$TASK" in
  S1-1)
    PROMPT=".codex/prompts/02-backend-crud.prompt.md"
    VERIFY=$'cd ruoyi-vue-pro\nmvn -pl yudao-server -am test\ncd ..'
    ;;
  S1-2)
    PROMPT=".codex/prompts/03-admin-pages.prompt.md"
    VERIFY=$'cd yudao-ui-admin-vue3\npnpm lint:eslint\npnpm ts:check\ncd ..'
    ;;
  S1-3)
    PROMPT=".codex/prompts/04-portal-pages.prompt.md"
    VERIFY=$'cd yudao-ui-admin-uniapp\npnpm dev:h5'
    ;;
  *)
    echo "不支持的任务: $TASK (可选: S1-1/S1-2/S1-3)"
    exit 1
    ;;
esac

echo "2) 把以下 Prompt 复制给 Codex"
echo "   cat ${PROMPT}"
echo

echo "3) 执行验收命令"
echo "$VERIFY"
echo

echo "4) 完成后提交"
echo '   git add <changed_files>'
echo '   git commit -m "feat(logistics): <task-id> <short description>"'


echo
echo "5) 极速执行（自动打印 Prompt + 验收）"
echo "   bash .codex/scripts/auto.sh ${TASK}"
echo "   bash .codex/scripts/auto.sh ${TASK} --verify"
