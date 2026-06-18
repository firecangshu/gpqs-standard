---
name: 门神 (Menshen)
description: 项目上线前的质量门禁检查（基于 GPQS V1.0 标准）。支持初始化、评估、CI/CD 检查三个核心功能。
trigger_phrases:
  - "评估我的项目"
  - "检查项目质量"
  - "门神检查"
  - "menshen"
  - "质量门禁"
  - "项目是否达到上线标准"
---

# 门神 (Menshen) Skill

**项目上线前的质量门禁检查（基于 GPQS V1.0 标准）**

---

## 功能概述

门神 Skill 提供 3 个核心命令：

| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `init` | 生成 YAML 模板 | 第一次使用，创建 `.gpqs/` 目录和 10 个模板文件 |
| `assess` | 运行评估 | 编辑完 YAML 后，生成评分报告 |
| `ci` | CI/CD 检查 | 在 CI/CD 流水线中使用，退出码表示通过/未通过 |

---

## 使用方法

### 1. 初始化（第一次使用）

**用户说**：
> "帮我初始化门神检查"
> "生成门神 YAML 模板"

**AI 执行**：
```bash
cd <项目根目录>
node "<menshen-cli路径>\menshen.js" init --project-path . --lang zh
```

**结果**：
- 创建 `.gpqs/` 目录
- 生成 10 个 YAML 模板文件：
  - `project_info.yaml`（项目基本信息）
  - `domain_knowledge.yaml`（领域知识清单）
  - `functionality_checklist.yaml`（功能清单与状态）
  - `test_coverage.yaml`（测试覆盖率）
  - `maintainability.yaml`（可维护性）
  - `security_checklist.yaml`（安全清单）
  - `deployment_readiness.yaml`（部署就绪度）
  - `feedback_loop.yaml`（反馈循环设计，GPQS 扩展）
  - `domain_prior_ledger.yaml`（领域先验台账，GPQS 扩展）
  - `adversarial_robustness.yaml`（对抗鲁棒性，GPQS 扩展）
  - `evaluation_evidence.md`（评估证据）
  - `README.md`（门神评估说明）

---

### 2. 编辑 YAML 文件（用户手动）

**用户说**：
> "我该怎么填写这些 YAML 文件？"

**AI 回答**（给出填写指南）：

#### `domain_knowledge.yaml` 填写示例

```yaml
knowledge_items:
  - id: "DK001"
    statement: "文旅项目必须符合国家文化旅游规划"
    source_type: "regulation"  # expert_experience / official_doc / case_study / regulation
    rarity: "high"  # high / medium / low
    practicality: "high"
    actionability: "high"
    reusability: "high"
    how_it_changes_agent_behavior: "在合规维度评分时，自动检查项目是否符合国家规划"
    evidence:
      level: "V2"  # V0 / V1 / V2 / V3 / V4 / V5
      description: "引用《国家文化旅游发展规划（2021-2035）》第 3.2 条"
```

#### `functionality_checklist.yaml` 填写示例

```yaml
modules:
  - id: "M001"
    name: "用户登录模块"
    description: "支持微信登录和手机号登录"
    status: "complete"  # complete / partial / not_started
    critical: true
reliability: 99.9  # 可靠性（百分比，99.9 表示 99.9% 请求成功）
```

#### `test_coverage.yaml` 填写示例

```yaml
validation_level: "V3"  # V0=无验证, V1=开发机测试, V2=测试环境, V3=预发布环境, V4=灰度发布, V5=全量发布
coverage_rate: 85  # 测试覆盖率（百分比）
```

---

### 3. 运行评估

**用户说**：
> "评估我的项目"
> "检查项目质量"
> "生成质量报告"

**AI 执行**：
```bash
cd <项目根目录>
node "<menshen-cli路径>\menshen.js" assess --project-path . --lang zh --output console
```

**结果**：
- 控制台输出评分报告（总分、维度评分、主要问题、改进建议）
- 生成 3 个报告文件：
  - `.gpqs/score.json`（机器可读）
  - `.gpqs/score-report.md`（人类可读）
  - `.gpqs/score-report.html`（网页展示）

**评分标准（7 个维度）**：

| 维度 | 权重 | 评分依据 |
|--------|------|----------|
| 1. 领域知识完整性 | 20% | `knowledge_items` 数量和质量 |
| 2. 功能完整性与可靠性 | 25% | `modules` 完成率和可靠性 |
| 3. 测试覆盖率与验证强度 | 20% | `validation_level` 和 `coverage_rate` |
| 4. 可维护性与迭代能力 | 15% | 代码复杂度、文档完整性、技术债务 |
| 5. 用户适配与个性化 | 5% | 用户反馈收集和改进机制 |
| 6. 业务价值与专家经验沉淀 | 5% | 业务指标和专家经验沉淀 |
| 7. 安全性与合规性 | 10% | 安全清单通过率 |

**及格线**：60 分（总分 100）

---

### 4. CI/CD 检查（高级用法）

**用户说**：
> "配置门神 CI/CD 检查"
> "在 GitHub Actions 中使用门神"

**AI 回答**（给出配置示例）：

#### GitHub Actions 配置示例

```yaml
# .github/workflows/menshen.yml
name: 门神质量门禁检查

on: [push, pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g js-yaml
      - run: node path/to/menshen.js init --project-path .
      - run: node path/to/menshen.js ci --project-path . --threshold 60
```

**说明**：
- `node menshen.js ci` 会根据评分结果返回退出码：
  - `0`：通过（总分 >= 阈值）
  - `1`：未通过（总分 < 阈值）
- GitHub Actions 会根据退出码判断是否通过检查

---

## 完整对话示例

### 示例 1：第一次使用

**用户**："帮我评估「踏歌行智策通」项目"

**AI**：
```
好的，我来帮你评估项目。

首先，我需要初始化门神检查（生成 YAML 模板）。

<执行：node menshen.js init --project-path . --lang zh>

✅ 初始化完成！已生成 .gpqs/ 目录和 10 个 YAML 模板文件。

接下来，请你填写这些 YAML 文件（至少填写以下 3 个）：
1. .gpqs/project_info.yaml（项目基本信息）
2. .gpqs/domain_knowledge.yaml（领域知识清单，至少 5 条）
3. .gpqs/functionality_checklist.yaml（功能模块清单）

填写完成后，告诉我"完成填写"，我再运行评估。
```

---

### 示例 2：填写完成后评估

**用户**："完成填写了"

**AI**：
```
好的，我来运行评估。

<执行：node menshen.js assess --project-path . --lang zh --output console>

📊 门神评估报告
==================================================
项目: 踏歌行智策通
总分: 72 / 100 ✅（及格线: 60）
==================================================

维度评分:
  1. 领域知识完整性                16/20 ✅
  2. 功能完整性与可靠性              20/25 ✅
  3. 测试覆盖率与验证强度            12/20 ⚠️
  4. 可维护性与迭代能力             11/15 ✅
  5. 用户适配与个性化                5/5 ✅
  6. 业务价值与专家经验沉淀           5/5 ✅
  7. 安全性与合规性                  3/10 ❌

主要问题:
  [P1] 测试覆盖率不足（当前 V2，目标 V3 以上）
  [P0] 安全清单通过率仅 30%（关键项未通过）

改进建议:
  1. 增加测试用例，目标：覆盖率 > 80%
  2. 完善安全清单（特别是数据加密和权限控制）
  3. 降低代码复杂度（当前 Cyclomatic Complexity: 15）

详细报告已保存到：
  - .gpqs/score.json
  - .gpqs/score-report.md
  - .gpqs/score-report.html

✅ 门神检查通过！总分: 72 / 100（及格线: 60）
```

---

### 示例 3：CI/CD 配置

**用户**："帮我在 GitHub Actions 中配置门神检查"

**AI**：
```
好的，我来帮你配置 GitHub Actions。

<创建文件：.github/workflows/menshen.yml>

✅ 已创建 GitHub Actions 配置文件。

工作流程：
1. 每次 push 或 pull_request 时触发
2. 自动运行门神检查
3. 如果总分 < 60，检查失败（退出码 1）

你可以通过 GitHub 的"Actions"标签页查看检查结果。
```

---

## 注意事项

### 1. 路径问题

**问题**：Windows 路径包含空格和中文，导致命令执行失败

**解决**：用引号包裹路径
```bash
node "C:\Users\My Projects\踏歌行\tools\menshen.js" init
```

### 2. 依赖问题

**问题**：`Cannot find module 'js-yaml'`

**解决**：在 `tools/cli/` 目录中运行 `npm install`

### 3. YAML 语法错误

**问题**：YAML 文件格式错误，导致解析失败

**解决**：
- 使用在线 YAML 校验器（如 https://www.yamllint.com/）
- 确保缩进正确（用空格，不用 Tab）
- 确保冒号后有空格（`key: value`，不是 `key:value`）

---

## 常见问题（FAQ）

### Q1：门神检查需要多少时间？

**A**：
- 初始化：~1 秒
- 评估（空 YAML）：~0.2 秒
- 评估（真实项目）：~1-5 秒（取决于 YAML 文件大小）

### Q2：门神检查会泄露我的代码吗？

**A**：不会。门神是**本地工具**，所有评估都在本地进行，不会上传代码到任何服务器。

### Q3：我可以自定义评分标准吗？

**A**：当前版本（V1.0）不支持自定义。如果需要自定义，可以修改 `assess.js` 中的 `calculateScore()` 函数。

### Q4：门神支持哪些项目类型？

**A**：支持 5 种项目类型（在 `project_info.yaml` 中设置）：
1. `task_agent`：任务型智能体
2. `workflow_agent`：流程型智能体
3. `capability_layer`：能力层
4. `practice_transform`：实践转化
5. `civilization_tool`：文明工具

---

## 来源与致谢

- **GPQS**（通用项目质量评估标准）：基于 **AVJ**（Agent Value Judgment）二创
- **AVJ**：来源 https://gitcode.com/team_kaixin/agent-value-judge.git
- **门神 Skill**：由"踏歌行智策通"团队开发

---

**最后更新**：2026-06-18
**版本**：V1.0
**维护者**：踏歌行智策通 Team
