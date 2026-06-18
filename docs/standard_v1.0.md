# GPQS 标准 V1.0

GPQS（通用项目质量评估标准）是一个开源的项目质量评估框架，适用于所有软件项目在上线前的标准化评估。

---

## 一、评分维度（7 个维度，总分 100 分）

### 维度 ①：领域知识完整性（20 分）

**定义**：项目是否沉淀了足够的领域知识（业务规则、行业规范、最佳实践）。

**评分标准**：
- **优秀（16-20 分）**：有 10+ 条领域知识条目，每条都有明确来源和实操性评估
- **良好（11-15 分）**：有 5-9 条领域知识条目，大部分有明确来源
- **及格（6-10 分）**：有 2-4 条领域知识条目，部分有明确来源
- **不及格（0-5 分）**：无领域知识条目，或条目无明确来源

**验证方式**：检查 `domain_knowledge.yaml` 文件

---

### 维度 ②：功能完整性与可靠性（25 分）

**定义**：项目功能是否完整、可靠，是否经过充分测试。

**评分标准**：
- **优秀（21-25 分）**：功能完整性 90%+，可靠性 99%+，有错误处理
- **良好（16-20 分）**：功能完整性 70-89%，可靠性 95-98%，有基本错误处理
- **及格（11-15 分）**：功能完整性 50-69%，可靠性 90-94%，有简单错误处理
- **不及格（0-10 分）**：功能完整性 < 50%，可靠性 < 90%，无错误处理

**验证方式**：检查 `functionality_checklist.yaml` 文件

---

### 维度 ③：测试覆盖率与验证强度（20 分）

**定义**：项目测试是否充分，是否经过真实环境验证。

**评分标准**：
- **V5（20 分）**：生产环境验证（A/B 测试、线上监控）
- **V4（16 分）**：用户验收测试（Beta 测试、灰度发布）
- **V3（12 分）**：系统测试（覆盖率 > 80%）
- **V2（8 分）**：集成测试（覆盖率 50-80%）
- **V1（4 分）**：单元测试（覆盖率 < 50%）
- **V0（0 分）**：无验证

**验证方式**：检查 `test_coverage.yaml` 文件

---

### 维度 ④：可维护性与迭代能力（15 分）

**定义**：项目是否易于维护和迭代，是否有技术债务管理。

**评分标准**：
- **优秀（13-15 分）**：代码复杂度低，文档完整，技术债务少，有迭代计划
- **良好（9-12 分）**：代码复杂度中等，文档基本完整，技术债务可控
- **及格（5-8 分）**：代码复杂度高，文档不完整，技术债务较多
- **不及格（0-4 分）**：代码复杂度极高，无文档，技术债务严重

**验证方式**：检查 `maintainability.yaml` 文件

---

### 维度 ⑤：用户适配与个性化（5 分，可选维度）

**定义**：项目是否支持个性化，是否能根据用户、任务、环境调整行为。

**评分标准**：
- **优秀（5 分）**：支持个性化，能根据用户、任务、环境自动调整
- **良好（3-4 分）**：支持部分个性化，需要手动配置
- **及格（1-2 分）**：支持基本个性化，但功能有限
- **不及格（0 分）**：不支持个性化

**验证方式**：检查 `user_adaptation.yaml` 文件（如果有）

---

### 维度 ⑥：业务价值与专家经验沉淀（5 分，可选维度）

**定义**：项目是否沉淀了专家经验，是否能放大专家能力。

**评分标准**：
- **优秀（5 分）**：沉淀了专家经验，能放大专家能力，降低后来者门槛
- **良好（3-4 分）**：部分沉淀了专家经验，能部分放大专家能力
- **及格（1-2 分）**：少量沉淀了专家经验，放大专家能力有限
- **不及格（0 分）**：未沉淀专家经验

**验证方式**：检查 `domain_knowledge.yaml` 文件中的 `expert_experience` 字段

---

### 维度 ⑦：安全性与合规性（10 分）

**定义**：项目是否安全、合规，是否有风险控制措施。

**评分标准**：
- **优秀（9-10 分）**：有完整的安全清单（10+ 项），所有项都通过
- **良好（6-8 分）**：有基本的安全清单（5-9 项），大部分项通过
- **及格（3-5 分）**：有简单的安全清单（< 5 项），部分项通过
- **不及格（0-2 分）**：无安全清单，或关键项未通过

**验证方式**：检查 `security_checklist.yaml` 文件

---

## 二、验证强度等级（V0-V5）

| 等级 | 名称 | 定义 | 示例 |
|------|------|------|------|
| V0 | 无验证 | 未经过任何测试 | 代码写完就上线 |
| V1 | 单元测试 | 有单元测试，但覆盖率低（< 50%） | 只有核心函数有测试 |
| V2 | 集成测试 | 有集成测试，覆盖率中等（50-80%） | API 测试、数据库测试 |
| V3 | 系统测试 | 有系统测试，覆盖主要功能（> 80%） | E2E 测试、UI 测试 |
| V4 | 用户验收测试 | 有真实用户参与测试 | Beta 测试、灰度发布 |
| V5 | 生产环境验证 | 在生产环境验证过，有监控和日志 | A/B 测试、线上监控 |

---

## 三、项目质量清单格式（7 个 YAML 文件）

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

---

## 四、评分流程

1. **生成项目质量清单**：运行 `npm run init -- --project-path ./your-project`
2. **填写 YAML 文件**：根据项目实际情况填写 7 个 YAML 文件
3. **评分**：运行 `npm run score -- --project-path ./your-project --lang zh`
4. **查看报告**：打开 `your-project/gpqs/score-report.html`

---

## 五、CI/CD 集成

### GitHub Actions 示例

```yaml
# .github/workflows/gpqs-check.yml
name: GPQS Check

on: [pull_request]

jobs:
  gpqs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run score -- --project-path . --lang zh
      - uses: actions/upload-artifact@v3
        with:
          name: gpqs-score-report
          path: gpqs/score-report.html
```

---

## 六、版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| V1.0 | 2026-06-18 | 初始版本，基于 AVJ V0.1 二创 |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
