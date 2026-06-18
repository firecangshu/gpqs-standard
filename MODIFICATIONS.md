# 与 AVJ 的差异说明 / Modifications from AVJ

本文档详细记录 GPQS 相对于原始 AVJ 项目的所有修改。

This document details all modifications made to the original AVJ project.

---

## 一、维度映射 / Dimension Mapping

GPQS 保留了 AVJ 的 7 个维度框架，但调整了名称和权重，使其适用于通用软件项目。

GPQS retains the 7-dimension framework of AVJ, but adjusts the names and weights to make it suitable for general software projects.

| AVJ 维度 | GPQS 维度 | 权重变化 | 修改原因 |
|-----------|------------|----------|----------|
| ① 领域先验沉淀度 | ① 领域知识完整性 | 35% → 20% | 降低权重，适用于所有专业领域项目 |
| ② 知识可执行化 | ② 功能完整性与可靠性 | 15% → 25% | 提高权重，强调功能完整性 |
| ③ 真实世界验证强度 | ③ 测试覆盖率与验证强度 | 15% → 20% | 重新定义验证强度等级（E0-E5 → V0-V5） |
| ④ 经验复利能力 | ④ 可维护性与迭代能力 | 10% → 15% | 强调代码质量和技术债务管理 |
| ⑤ 个体化/情境化适配 | ⑤ 用户适配与个性化 | 10% → 5% | 可选维度（非所有项目必需） |
| ⑥ 专家放大系数 | ⑥ 业务价值与专家经验沉淀 | 10% → 5% | 可选维度（专业服务类项目必需） |
| ⑦ 安全与边界治理 | ⑦ 安全性与合规性 | 5% → 10% | 提高权重，所有项目的底线 |

**修改说明**：
- 维度 ①、②、⑦ 的权重调整是为了适用于通用软件项目
- 维度 ⑤、⑥ 改为可选维度，因为不是所有项目都需要个性化或专家经验沉淀
- 维度 ③ 的验证强度等级完全重新定义（见下文）

---

## 二、验证强度等级映射 / Evidence Level Mapping

AVJ 的验证强度等级（E0-E5）是专门为 AI Agent 设计的，GPQS 将其重新定义为通用的验证强度等级（V0-V5）。

AVJ's evidence levels (E0-E5) are designed specifically for AI Agents. GPQS redefines them as general validation levels (V0-V5).

| AVJ 证据等级 | GPQS 验证等级 | 定义变化 |
|---------------|----------------|----------|
| E0: 无证据 | V0: 无验证 | **一致**：未经过任何测试 |
| E1: 设计文档 | V1: 单元测试 | **完全重新定义**：有单元测试，但覆盖率低（< 50%） |
| E2: 模拟测试 | V2: 集成测试 | **完全重新定义**：有集成测试，覆盖率中等（50-80%） |
| E3: 真实用户 | V3: 系统测试 | **完全重新定义**：有系统测试，覆盖主要功能（> 80%） |
| E4: 连续使用数据 | V4: 用户验收测试 | **完全重新定义**：有真实用户参与测试 |
| E5: 长期生产验证 | V5: 生产环境验证 | **部分一致**：在生产环境验证过，有监控和日志 |

**修改原因**：
- AVJ 的 E1-E5 定义过于偏向 AI（如"模拟测试"、"连续使用数据"）
- GPQS 的 V0-V5 定义适用于所有软件项目（单元测试、集成测试、系统测试、用户验收测试、生产环境验证）

---

## 三、字段映射 / Field Mapping

AVJ 的 YAML 文件是专门为 AI Agent 设计的，GPQS 将其重新设计为通用的项目质量清单格式。

AVJ's YAML files are designed specifically for AI Agents. GPQS redesigns them as general project quality checklist formats.

| AVJ 文件 | GPQS 文件 | 字段变化 |
|-----------|------------|----------|
| `project_card.yaml` | `project_info.yaml` | 字段名改为通用（`project_name`、`version`、`domain` 等） |
| `domain_prior_ledger.yaml` | `domain_knowledge.yaml` | 格式：`priors` → `knowledge_items` |
| `execution_protocols.yaml` | `functionality_checklist.yaml` | 格式：执行协议 → 功能模块清单 |
| `evidence_map.yaml` | `test_coverage.yaml` | 格式：证据映射 → 测试覆盖率报告 |
| `feedback_loop.yaml` | `maintainability.yaml` | 格式：7 个布尔字段 → 5 个评估维度 |
| `adaptation.yaml` | `user_adaptation.yaml` | 格式：5 个布尔字段 → 用户适配评估 |
| `safety_boundary.yaml` | `security_checklist.yaml` | 格式：安全边界 → 安全与合规性清单 |
| `open_source_provenance.yaml` | `deployment_readiness.yaml` | 格式：开源来源 → 上线准备清单 |
| `social_civilization.yaml` | （删除） | 社会责任维度合并到 `security_checklist.yaml` |
| `risk_flags.yaml` | （删除） | 风险标记合并到 `security_checklist.yaml` |
| `expert_collaboration.yaml` | （删除） | 专家协作维度合并到 `domain_knowledge.yaml` |

**修改原因**：
- AVJ 的 YAML 文件字段过于偏向 AI（如 `priors`、`feedback_loop`）
- GPQS 的 YAML 文件字段适用于所有软件项目（如 `knowledge_items`、`test_coverage`）

---

## 四、评分规则映射 / Scoring Rules Mapping

AVJ 的评分规则是为 AI Agent 设计的，GPQS 将其调整为适用于通用软件项目的评分规则。

AVJ's scoring rules are designed for AI Agents. GPQS adjusts them to be suitable for general software projects.

| AVJ 评分规则 | GPQS 评分规则 | 变化 |
|---------------|----------------|------|
| 维度 ①：规则数量（16+4 条） | 维度 ①：领域知识条目数量（10+ 条） | 评分标准更通用 |
| 维度 ②：流程步骤数量（9 步） | 维度 ②：功能模块数量（5+ 个） | 评分标准更通用 |
| 维度 ③：真实 API 数量（3+ 个） | 维度 ③：测试覆盖率（80%+） | 评分标准完全重新定义 |
| 维度 ④：反馈循环（7 个布尔字段） | 维度 ④：可维护性（5 个评估维度） | 评分标准完全重新定义 |
| 维度 ⑤：适配能力（5 个布尔字段） | 维度 ⑤：用户适配（3 个评估维度） | 评分标准完全重新定义 |
| 维度 ⑥：专家放大（未定义） | 维度 ⑥：业务价值（3 个评估维度） | 新增评分标准 |
| 维度 ⑦：安全声明（必须） | 维度 ⑦：安全清单（10+ 项） | 评分标准更严格 |

**修改原因**：
- AVJ 的评分规则过于偏向 AI（如"规则数量"、"反馈循环"）
- GPQS 的评分规则适用于所有软件项目（如"测试覆盖率"、"可维护性"）

---

## 五、工具映射 / Tool Mapping

AVJ 提供了 Python 评分引擎，GPQS 将其改造为支持多种项目类型的评分工具。

AVJ provides a Python scoring engine. GPQS transforms it into a scoring tool that supports multiple project types.

| AVJ 工具 | GPQS 工具 | 变化 |
|-----------|------------|------|
| Python 评分引擎 | Node.js + Python 混合 | 支持更多项目类型 |
| 命令行工具（无） | CLI 工具（Node.js） | 新增 |
| Web 界面（无） | Web 界面（HTML + JS） | 新增 |
| CI/CD 插件（无） | GitHub Actions 插件 | 新增 |

**修改原因**：
- AVJ 只提供了 Python 评分引擎，不适用于所有项目
- GPQS 提供多种工具，适用于更多场景

---

## 六、许可证 / License

AVJ 项目未明确指定许可证。GPQS 使用 **MIT License**（开源标准）。

AVJ project does not specify a license. GPQS uses **MIT License** (open-source standard).

---

## 七、致谢 / Acknowledgments

GPQS 项目基于 AVJ 二创，感谢 AVJ 作者的开创性工作。

GPQS project is forked from AVJ, thanks to the original author's pioneering work.

**AVJ 项目信息**：
- 仓库地址：https://gitcode.com/team_kaixin/agent-value-judge
- 作者：team_kaixin
- 创建时间：2026 年（具体时间未知）

**GPQS 项目信息**：
- 仓库地址：https://github.com/firecangshu/gpqs-standard
- 作者：firecangshu
- 创建时间：2026-06-18
- 版本：V1.0

---

## 八、详细修改记录 / Detailed Modification History

| 日期 | 修改内容 | 修改人 |
|------|----------|----------|
| 2026-06-18 | 创建 GPQS 项目，基于 AVJ V0.1 二创 | firecangshu |
| 2026-06-18 | 调整 7 个维度的名称和权重 | firecangshu |
| 2026-06-18 | 重新定义验证强度等级（E0-E5 → V0-V5） | firecangshu |
| 2026-06-18 | 重新设计 YAML 格式（AI 专用 → 通用） | firecangshu |
| 2026-06-18 | 开发中英双语支持（文档、界面、输出） | firecangshu |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
