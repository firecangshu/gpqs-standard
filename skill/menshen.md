# 门神 / Menshen

> 项目上线前的质量门禁检查（基于 GPQS V1.0 标准）

---

## 触发词 / Trigger

### 中文触发词
- "用门神检查项目"
- "门神评估"
- "门神初始化"
- "门神集成到 CI"

### English Trigger
- "Menshen check"
- "Menshen assess"
- "Menshen init"
- "Menshen CI"

---

## 功能 / Features

### 1. 初始化（Init）
生成项目质量清单（7 个 YAML 文件）。

**触发词**："门神初始化" / "Menshen init"

**执行流程**：
1. 询问项目路径（或自动检测当前目录）
2. 扫描项目结构（代码、测试、文档）
3. 生成 `gpqs/` 目录和 7 个 YAML 文件（初版）
4. 提示用户确认和修改

**输出**：
```
✅ 门神初始化完成！

已生成以下文件：
- gpqs/project_info.yaml
- gpqs/domain_knowledge.yaml
- gpqs/functionality_checklist.yaml
- gpqs/test_coverage.yaml
- gpqs/maintainability.yaml
- gpqs/security_checklist.yaml
- gpqs/deployment_readiness.yaml

请检查并修改这些文件，然后运行「门神评估」。
```

---

### 2. 评估（Assess）
评估项目质量，输出评分报告。

**触发词**："用门神检查项目" / "门神评估" / "Menshen check"

**执行流程**：
1. 读取 `gpqs/` 目录下的 7 个 YAML 文件
2. 运行 GPQS 评分引擎
3. 计算 7 个维度的分数（总分 100）
4. 生成评分报告（JSON + HTML + Markdown）

**输出**：
```
📊 门神评估报告

项目：踏歌行智策通
总分：68 / 100 （及格线：60 分）

维度评分：
① 领域知识完整性：15/20 ✅
② 功能完整性与可靠性：18/25 ⚠️
③ 测试覆盖率与验证强度：10/20 ❌
④ 可维护性与迭代能力：8/15 ⚠️
⑤ 用户适配与个性化：3/5 ✅
⑥ 业务价值与专家经验沉淀：2/5 ⚠️
⑦ 安全性与合规性：4/10 ❌

主要问题：
1. [P0] 测试覆盖率低（< 30%）
2. [P0] 缺少安全边界声明
3. [P1] 代码复杂度高（cyclomatic complexity > 10）

改进建议：
1. 增加单元测试（目标：覆盖率 > 80%）
2. 在 W9 成果页添加免责声明
3. 重构高复杂度函数

详细报告已保存到：gpqs/score-report.html
```

---

### 3. CI/CD 集成（CI）
集成到 GitHub Actions，每次 PR 自动检查。

**触发词**："门神集成到 CI" / "Menshen CI"

**执行流程**：
1. 生成 `.github/workflows/menshen-check.yml`
2. 配置：每次 PR 自动运行门神评估
3. 如果总分 < 60，自动评论到 PR 并阻止合并

**输出**：
```yaml
# .github/workflows/menshen-check.yml
name: 门神质量检查 / Menshen Quality Check

on:
  pull_request:
    branches: [main, dev-*]

jobs:
  menshen-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 运行门神评估 / Run Menshen Assessment
        run: |
          npx @gpqs/menshen assess --project-path . --lang zh
      - name: 检查评分结果 / Check Score
        run: |
          SCORE=$(cat gpqs/score.json | jq '.overall')
          if [ $SCORE -lt 60 ]; then
            echo "❌ 门神检查未通过！总分：$SCORE / 100"
            exit 1
          else
            echo "✅ 门神检查通过！总分：$SCORE / 100"
          fi
```

---

## 使用方式 / Usage

### 命令行 / CLI

```bash
# 初始化
npx @gpqs/menshen init --project-path ./my-project

# 评估
npx @gpqs/menshen assess --project-path ./my-project --lang zh

# CI/CD 检查
npx @gpqs/menshen ci --project-path ./my-project --threshold 60
```

### WorkBuddy 调用 / WorkBuddy Invocation

```
用户："用门神检查项目"

AI：
好的，我来帮你用门神检查项目。

请问项目路径是？
（或：检测到当前目录是 `C:\Users\User\WorkBuddy\2026-06-17-19-58-35\gpqs-standard`，是否检查这个项目？）

用户："是"

AI：
✅ 门神检查完成！

📊 评分结果：
总分：68 / 100 （及格）

主要问题：
1. [P0] 测试覆盖率低
2. [P0] 缺少安全边界声明

详细报告已保存到：`gpqs/score-report.html`
```

---

## 评分标准 / Scoring Standard

基于 GPQS V1.0（通用项目质量评估标准）。

详细标准请见：https://github.com/firecangshu/gpqs-standard/blob/main/docs/standard_v1.0.md

### 7 个评分维度

| 维度 | 权重 | 说明 |
|------|------|------|
| ① 领域知识完整性 | 20% | 项目是否沉淀了足够的领域知识 |
| ② 功能完整性与可靠性 | 25% | 项目功能是否完整、可靠 |
| ③ 测试覆盖率与验证强度 | 20% | 项目测试是否充分 |
| ④ 可维护性与迭代能力 | 15% | 项目是否易于维护和迭代 |
| ⑤ 用户适配与个性化 | 5% | 项目是否支持个性化（可选维度） |
| ⑥ 业务价值与专家经验沉淀 | 5% | 项目是否沉淀了专家经验（可选维度） |
| ⑦ 安全性与合规性 | 10% | 项目是否安全、合规 |

---

## 及格线 / Passing Threshold

- **推荐**：60 分（总分 100）
- **严格**：70 分（总分 100）
- **宽松**：50 分（总分 100）

可在 `gpqs/config.yaml` 中配置。

---

## 输出格式 / Output Format

支持以下格式：
- JSON：`gpqs/score.json`
- HTML：`gpqs/score-report.html`
- Markdown：`gpqs/score-report.md`
- Console：直接在终端显示

---

## 来源 / Origin

本 Skill 基于 [GPQS (General Project Quality Standard)](https://github.com/firecangshu/gpqs-standard) 实现。

GPQS 基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创。

---

## 许可证 / License

MIT License

---

## 致谢 / Acknowledgments

感谢 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 提供原始评分框架。

感谢 [GPQS](https://github.com/firecangshu/gpqs-standard) 提供通用项目质量评估标准。
