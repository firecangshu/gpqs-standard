# 门神评估工作流 / Menshen Assess Workflow

> 评估项目质量，输出评分报告（基于 GPQS V1.0 标准）

---

## 触发词 / Trigger

### 中文
- "用门神检查项目"
- "门神评估"
- "门神评分"

### English
- "Menshen check"
- "Menshen assess"
- "Menshen score"

---

## 输入参数 / Input Parameters

| 参数 | 必填 | 说明 |
|------|------|------|
| `project-path` | 是 | 项目根目录路径 |
| `lang` | 否 | 输出语言（`zh` / `en`，默认 `zh`） |
| `output` | 否 | 输出格式（`json` / `html` / `markdown` / `console`，默认 `console`） |
| `threshold` | 否 | 及格线（默认 60 分） |

---

## 执行流程 / Execution Flow

### 步骤 1：获取项目路径

**询问用户**（如果未提供 `project-path`）：
```
请提供项目路径（绝对路径或相对路径）：

例如：
- ./my-project
- C:\Users\User\WorkBuddy\my-project
```

**自动检测**（如果用户在项目根目录）：
```
检测到当前目录：{current_dir}

是否使用当前目录作为项目路径？
- 是：直接使用
- 否：请提供其他路径
```

---

### 步骤 2：检查 YAML 文件

**执行**：
1. 检查 `gpqs/` 目录是否存在
2. 检查 7 个 YAML 文件是否齐全：
   - `gpqs/project_info.yaml`
   - `gpqs/domain_knowledge.yaml`
   - `gpqs/functionality_checklist.yaml`
   - `gpqs/test_coverage.yaml`
   - `gpqs/maintainability.yaml`
   - `gpqs/security_checklist.yaml`
   - `gpqs/deployment_readiness.yaml`

**如果文件不齐全**：
```
⚠️ 检测到 gpqs/ 目录不完整！

缺少以下文件：
- gpqs/test_coverage.yaml
- gpqs/maintainability.yaml

是否运行「门神初始化」生成缺失的文件？
- 是：运行 menshen-init 工作流
- 否：请手动创建缺失的文件，然后重新运行评估
```

---

### 步骤 3：运行评分引擎

**执行**：
1. 读取 7 个 YAML 文件
2. 根据 `rubrics/core_v1.0.yaml` 计算分数
3. 计算 7 个维度的分数（总分 100）
4. 生成评分报告

**评分逻辑**（简化版）：
```javascript
// 维度 ①：领域知识完整性（20 分）
function scoreDimension1(domainKnowledgeYaml) {
  const items = domainKnowledgeYaml.knowledge_items;
  let score = 0;
  
  // 1. 数量（0-5 分）
  const countScore = Math.min(items.length * 1, 5);
  
  // 2. 质量（0-10 分）
  const qualityScore = items.reduce((acc, item) => {
    let itemScore = 0;
    if (item.rarity === 'high') itemScore += 2;
    else if (item.rarity === 'medium') itemScore += 1;
    
    if (item.practicality === 'high') itemScore += 2;
    else if (item.practicality === 'medium') itemScore += 1;
    
    if (item.actionability === 'high') itemScore += 2;
    else if (item.actionability === 'medium') itemScore += 1;
    
    if (item.reusability === 'high') itemScore += 2;
    else if (item.reusability === 'medium') itemScore += 1;
    
    return acc + Math.min(itemScore, 5);
  }, 0);
  
  // 3. 证据（0-5 分）
  const evidenceScore = items.reduce((acc, item) => {
    const level = parseInt(item.evidence.level.replace('E', ''));
    return acc + Math.min(level, 5);
  }, 0);
  
  score = countScore + qualityScore + evidenceScore;
  return Math.min(score, 20);
}

// 维度 ②：功能完整性与可靠性（25 分）
function scoreDimension2(functionalityChecklistYaml) {
  const modules = functionalityChecklistYaml.modules;
  let score = 0;
  
  // 1. 实现状态（0-10 分）
  const implementedCount = modules.filter(m => m.status === 'implemented').length;
  const implementationScore = (implementedCount / modules.length) * 10;
  
  // 2. 测试状态（0-10 分）
  const testedCount = modules.filter(m => m.test_status === 'complete').length;
  const testingScore = (testedCount / modules.length) * 10;
  
  // 3. 覆盖率（0-5 分）
  const avgCoverage = modules.reduce((acc, m) => {
    return acc + parseInt(m.test_coverage);
  }, 0) / modules.length;
  const coverageScore = (avgCoverage / 100) * 5;
  
  score = implementationScore + testingScore + coverageScore;
  return Math.min(score, 25);
}

// ... 其他维度类似
```

---

### 步骤 4：生成评分报告

**输出格式**：

#### 格式 1：Console（默认）

```
📊 门神评估报告

项目：踏歌行智策通
总分：68 / 100 （及格线：60 分）✅

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

#### 格式 2：JSON

```json
{
  "project_name": "踏歌行智策通",
  "version": "v0.0.4",
  "overall_score": 68,
  "passing_threshold": 60,
  "passed": true,
  "dimensions": [
    {
      "id": 1,
      "name": "领域知识完整性",
      "weight": 20,
      "score": 15,
      "status": "good"
    },
    {
      "id": 2,
      "name": "功能完整性与可靠性",
      "weight": 25,
      "score": 18,
      "status": "warning"
    },
    // ... 其他维度
  ],
  "major_issues": [
    {
      "priority": "P0",
      "description": "测试覆盖率低（< 30%）"
    },
    {
      "priority": "P0",
      "description": "缺少安全边界声明"
    }
  ],
  "improvement_suggestions": [
    "增加单元测试（目标：覆盖率 > 80%）",
    "在 W9 成果页添加免责声明",
    "重构高复杂度函数"
  ],
  "report_path": "gpqs/score-report.html",
  "assessed_at": "2026-06-18T15:52:22+08:00"
}
```

#### 格式 3：HTML

生成 `gpqs/score-report.html`，包含：
- 总分（仪表盘样式）
- 7 个维度的柱状图
- 主要问题列表（按优先级排序）
- 改进建议列表

#### 格式 4：Markdown

生成 `gpqs/score-report.md`，包含：
```markdown
# 门神评估报告

## 项目信息

- 项目名称：踏歌行智策通
- 版本：v0.0.4
- 评估时间：2026-06-18 15:52:22

## 总分

**68 / 100** ✅ （及格）

## 维度评分

| 维度 | 权重 | 分数 | 状态 |
|------|------|------|------|
| ① 领域知识完整性 | 20% | 15/20 | ✅ |
| ② 功能完整性与可靠性 | 25% | 18/25 | ⚠️ |
| ③ 测试覆盖率与验证强度 | 20% | 10/20 | ❌ |
| ④ 可维护性与迭代能力 | 15% | 8/15 | ⚠️ |
| ⑤ 用户适配与个性化 | 5% | 3/5 | ✅ |
| ⑥ 业务价值与专家经验沉淀 | 5% | 2/5 | ⚠️ |
| ⑦ 安全性与合规性 | 10% | 4/10 | ❌ |

## 主要问题

### [P0] 测试覆盖率低（< 30%）

- **影响**：代码质量无法保证，容易引入 Bug
- **改进建议**：增加单元测试（目标：覆盖率 > 80%）

### [P0] 缺少安全边界声明

- **影响**：可能被误用，导致法律风险
- **改进建议**：在 W9 成果页添加免责声明

### [P1] 代码复杂度高（cyclomatic complexity > 10）

- **影响**：代码难以维护，容易引入 Bug
- **改进建议**：重构高复杂度函数（目标：圈复杂度 < 10）

## 改进建议

1. 增加单元测试（目标：覆盖率 > 80%）
2. 在 W9 成果页添加免责声明
3. 重构高复杂度函数

## 详细报告

HTML 版本：gpqs/score-report.html
JSON 版本：gpqs/score.json
```

---

### 步骤 5：判断是否通过

**执行**：
1. 比较总分和及格线（默认 60 分）
2. 如果总分 >= 及格线，输出 ✅ 通过
3. 如果总分 < 及格线，输出 ❌ 未通过，并阻止合并（如果是 CI/CD 环境）

**输出**：

```
✅ 门神检查通过！总分：68 / 100 （及格线：60 分）

详细报告已保存到：gpqs/score-report.html
```

或者：

```
❌ 门神检查未通过！总分：48 / 100 （及格线：60 分）

主要问题：
1. [P0] 测试覆盖率低（< 30%）
2. [P0] 缺少安全边界声明

请修复主要问题后，重新运行评估。

详细报告已保存到：gpqs/score-report.html
```

---

## 输出格式 / Output Format

### 成功输出

```
📊 门神评估报告

项目：踏歌行智策通
总分：68 / 100 （及格线：60 分）✅

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

### 错误输出

```
❌ 门神评估失败！

错误原因：{error_message}

请检查：
1. 项目路径是否正确？
2. gpqs/ 目录是否存在？
3. 7 个 YAML 文件是否齐全？

修复后重试。
```

---

## 后续步骤 / Next Steps

1. **查看详细报告**
   - 打开 `gpqs/score-report.html`（浏览器）
   - 或打开 `gpqs/score-report.md`（文本编辑器）

2. **修复主要问题**
   - 按照「主要问题」列表，逐项修复
   - 按照「改进建议」，逐项改进

3. **重新运行评估**
   - 触发词："门神评估" / "Menshen assess"
   - 查看分数是否提升

4. **（可选）集成到 CI/CD**
   - 触发词："门神集成到 CI" / "Menshen CI"
   - 生成 `.github/workflows/menshen-check.yml`
   - 每次 PR 自动运行门神评估

---

## 示例 / Example

### 用户输入

```
用门神检查项目
```

### AI 输出

```
好的，我来帮你用门神检查项目。

请提供项目路径（绝对路径或相对路径）：

例如：
- ./my-project
- C:\Users\User\WorkBuddy\my-project
```

### 用户输入

```
C:\Users\User\WorkBuddy\2026-05-28-13-07-15\版本库\参赛演示版本zhicetong - 副本
```

### AI 输出

```
正在检查项目...

✅ 项目路径正确！
✅ gpqs/ 目录存在！
✅ 7 个 YAML 文件齐全！

正在运行评分引擎...

📊 门神评估报告

项目：踏歌行智策通
总分：68 / 100 （及格线：60 分）✅

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

## 来源 / Origin

本工作流基于 [GPQS (General Project Quality Standard)](https://github.com/firecangshu/gpqs-standard) 实现。

GPQS 基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创。

---

## 许可证 / License

MIT License

---

## 致谢 / Acknowledgments

感谢 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 提供原始评分框架。

感谢 [GPQS](https://github.com/firecangshu/gpqs-standard) 提供通用项目质量评估标准。
