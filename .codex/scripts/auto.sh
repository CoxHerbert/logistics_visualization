#!/usr/bin/env bash
set -euo pipefail

TASK="${1:-S1-1}"
VERIFY_ONLY="${2:-}"

run_cmd() {
  echo "\n>>> $*"
  bash -lc "$*"
}

print_prompt_path() {
  case "$TASK" in
    S1-1) echo ".codex/prompts/02-backend-crud.prompt.md" ;;
    S1-2) echo ".codex/prompts/03-admin-pages.prompt.md" ;;
    S1-3) echo ".codex/prompts/04-portal-pages.prompt.md" ;;
    *)
      echo "Unsupported task: $TASK (S1-1/S1-2/S1-3)" >&2
      exit 1
      ;;
  esac
}

run_verify() {
  case "$TASK" in
    S1-1)
      run_cmd "cd ruoyi-vue-pro && mvn -pl yudao-server -am test"
      ;;
    S1-2)
      run_cmd "cd yudao-ui-admin-vue3 && pnpm lint:eslint"
      run_cmd "cd yudao-ui-admin-vue3 && pnpm ts:check"
      ;;
    S1-3)
      echo "S1-3 包含 dev server，默认只做命令提示："
      echo "cd yudao-ui-admin-uniapp && pnpm dev:h5"
      ;;
  esac
}

PROMPT_PATH="$(print_prompt_path)"

echo "[Codex 自动执行] task=$TASK"
echo "Prompt 文件: $PROMPT_PATH"

if [[ "$VERIFY_ONLY" == "--verify" ]]; then
  echo "仅执行验收命令..."
  run_verify
  exit 0
fi

echo "\n=== Step 1/3: 显示 Prompt（复制给 Codex） ==="
cat "$PROMPT_PATH"

echo "\n=== Step 2/3: 等 Codex 完成改动后，执行验收 ==="
run_verify

echo "\n=== Step 3/3: 建议提交 ==="
echo 'git add <changed_files>'
echo "git commit -m 'feat(logistics): ${TASK} <short description>'"
