#!/bin/sh
# 一键安装 git 钩子(换机器/新 clone 后跑一次)
# 用法: sh scripts/install-hooks.sh
root=$(git rev-parse --show-toplevel) || { echo "不在 git 仓库内"; exit 1; }
cp "$root/scripts/git-hooks/pre-commit" "$root/.git/hooks/pre-commit"
chmod +x "$root/.git/hooks/pre-commit"
echo "✅ pre-commit 钩子已安装 → $root/.git/hooks/pre-commit"
