# scripts/

## git 钩子（PII / 敏感文件拦截）

`git-hooks/pre-commit`：提交前扫描暂存区，命中即拦——
- 真实身份 PII（真名 / 公司邮箱）——本项目 AI 工作流已三次误塞真名+公司邮箱作样例数据
- 敏感文件（`.env` / `*.db` / `*.pem` / `CLAUDE.md` / `secrets.*`）
- 密钥指纹（sk- / ghp_ / PRIVATE KEY / postgres 连接串）

### 安装（新 clone / 换机器后跑一次）
```sh
sh scripts/install-hooks.sh
```
git 钩子存在 `.git/hooks/` 下、不随仓库走，故新环境需手动装一次。

### 误报绕过
`git commit --no-verify`（CLAUDE.md 默认禁用 --no-verify，仅确认误报时用）。
