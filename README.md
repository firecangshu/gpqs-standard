# GPQS (General Project Quality Standard)

> 基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创的开源项目质量评估标准。

**关键词 / Keywords**: `quality-assurance`, `project-quality`, `scoring-system`, `GPQS`, `AVJ`, `agent-value-judgment`, `code-quality`, `project-management`, `CI/CD`, `DevOps`, `YAML`, `JSON-Schema`, `bilingual`, `open-source`, `standard`, `CLI-tool`, `quality-gates`, `pre-release`, `fork`, `derivative`, `质量保证`, `项目质量`, `评分系统`, `代码质量`, `项目管理`, `持续集成`, `上线前检查`, `中英双语`, `开源`, `标准`, `二创`, `衍生项目`

[English](README_EN.md) | [修改说明](MODIFICATIONS.md) | [贡献指南](CONTRIBUTING.md) | [关键词索引](KEYWORDS.md)

---

## 项目介绍 / Project Introduction

**GPQS（通用项目质量评估标准）** 是一个开源的项目质量评估框架，适用于所有软件项目在上线前的标准化评估。

**核心理念**：
- ✅ **通用性**：去除 AI Agent 专属指标，改为通用软件项目质量评估
- ✅ **可量化**：所有维度都可评分（0-100 分）
- ✅ **可追溯**：所有评分结果存档，支持审计和复盘
- ✅ **中英双语**：所有文档、界面、输出都支持中文和英文

**与 AVJ 的关系**：
- 本项目基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创
- 尊重原创，已在所有关键位置标明来源
- 详细修改说明请见 [MODIFICATIONS.md](MODIFICATIONS.md)

---

## 快速开始 / Quick Start

### 1. 安装 / Installation

```bash
# 克隆仓库 / Clone repository
git clone https://github.com/firecangshu/gpqs-standard.git
cd gpqs-standard

# 安装依赖 / Install dependencies
npm install  # 或使用 pnpm / or use pnpm
```

### 2. 评估你的项目 / Assess Your Project

```bash
# 生成项目质量清单 / Generate project quality checklist
npm run init -- --project-path ./your-project

# 评分 / Score
npm run score -- --project-path ./your-project --lang zh

# 输出 HTML 报告 / Output HTML report
npm run score -- --project-path ./your-project --output html --lang zh
```

### 3. 查看评分结果 / View Scoring Results

评分结果会保存在 `your-project/gpqs/score-report.html`，用浏览器打开即可查看。

---

## 评分维度 / Scoring Dimensions

GPQS 包含 7 个评分维度（总分 100 分）：

| 维度 | 权重 | 说明 |
|------|------|------|
| ① 领域知识完整性 | 20% | 项目是否沉淀了足够的领域知识 |
| ② 功能完整性与可靠性 | 25% | 项目功能是否完整、可靠 |
| ③ 测试覆盖率与验证强度 | 20% | 项目测试是否充分 |
| ④ 可维护性与迭代能力 | 15% | 项目是否易于维护和迭代 |
| ⑤ 用户适配与个性化 | 5% | 项目是否支持个性化（可选维度） |
| ⑥ 业务价值与专家经验沉淀 | 5% | 项目是否沉淀了专家经验（可选维度） |
| ⑦ 安全性与合规性 | 10% | 项目是否安全、合规 |

详细评分规则请见 [docs/scoring_rules.md](docs/scoring_rules.md)。

---

## 项目质量清单 / Project Quality Checklist

每个项目都需要创建 `gpqs/` 目录，并填写以下 7 个 YAML 文件：

| 文件名 | 用途 | 格式规范 |
|--------|------|----------|
| `project_info.yaml` | 项目基本信息 | [schema](schemas/project_info.yaml.schema.json) |
| `domain_knowledge.yaml` | 领域知识清单 | [schema](schemas/domain_knowledge.yaml.schema.json) |
| `functionality_checklist.yaml` | 功能完整性清单 | [schema](schemas/functionality_checklist.yaml.schema.json) |
| `test_coverage.yaml` | 测试覆盖率报告 | [schema](schemas/test_coverage.yaml.schema.json) |
| `maintainability.yaml` | 可维护性评估 | [schema](schemas/maintainability.yaml.schema.json) |
| `security_checklist.yaml` | 安全与合规性清单 | [schema](schemas/security_checklist.yaml.schema.json) |
| `deployment_readiness.yaml` | 上线准备清单 | [schema](schemas/deployment_readiness.yaml.schema.json) |

示例文件请见 [examples/](examples/)。

---

## 工具 / Tools

GPQS 提供以下工具：

| 工具 | 用途 | 位置 |
|------|------|------|
| CLI 工具 | 命令行评分 | [tools/cli/](tools/cli/) |
| Web 界面 | 在线评分 | [tools/web/](tools/web/) |
| CI/CD 插件 | 集成到 GitHub Actions | [tools/ci/](tools/ci/) |

---

## 贡献 / Contributing

欢迎贡献！请见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 许可证 / License

[MIT License](LICENSE)

---

## 致谢 / Acknowledgments

本项目基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创，感谢 [team_kaixin](https://gitcode.com/team_kaixin) 的开创性工作。

---
