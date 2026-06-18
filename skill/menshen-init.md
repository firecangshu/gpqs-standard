# 门神初始化工作流 / Menshen Init Workflow

> 生成项目质量清单（7 个 YAML 文件）

---

## 触发词 / Trigger

### 中文
- "门神初始化"
- "门神 init"
- "生成质量清单"

### English
- "Menshen init"
- "Menshen initialize"
- "Generate quality checklist"

---

## 输入参数 / Input Parameters

| 参数 | 必填 | 说明 |
|------|------|------|
| `project-path` | 是 | 项目根目录路径 |
| `lang` | 否 | 输出语言（`zh` / `en`，默认 `zh`） |

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

### 步骤 2：扫描项目结构

**执行**：
1. 读取项目根目录
2. 识别项目类型（Web / 移动端 / 桌面端 / AI Agent）
3. 扫描以下目录和文件：
   - 源代码：`src/`、`lib/`、`app/`、`pages/`
   - 测试：`test/`、`tests/`、`__tests__/`、`*.test.js`
   - 文档：`docs/`、`README.md`、`API.md`
   - 配置：`package.json`、`project.config.json`、`.json`
   - CI/CD：`.github/workflows/`、`jenkins.groovy`
   - Docker：`Dockerfile`、`docker-compose.yml`

**输出**：
```
✅ 项目扫描完成！

项目类型：微信小程序（WeChat Mini Program）
源代码文件：14 个
测试文件：0 个
文档文件：1 个
配置文件：3 个

检测到的问题：
- [P0] 没有测试文件
- [P1] 缺少 LICENSE 文件
- [P2] 文档不完整（只有 README.md）
```

---

### 步骤 3：生成 YAML 文件（初版）

**执行**：
1. 创建 `gpqs/` 目录（如果不存在）
2. 生成 7 个 YAML 文件（初版，基于扫描结果）

#### 文件 1：`gpqs/project_info.yaml`

```yaml
# 项目基本信息 / Project Basic Info
project_name: "踏歌行智策通"
project_name_en: "Tageting Smart Policy"
version: "v0.0.4"
project_type: "workflow_agent"  # 5 种类型之一
domain: "文化旅游"
domain_en: "Cultural Tourism"
description: |
  文旅项目战略定位辅助智能体。
  AI-powered strategic positioning assistant for cultural tourism projects.
maintainers:
  - name: "张三"
    role: "项目负责人"
    email: "zhangsan@example.com"
tech_stack:
  - "微信小程序"
  - "JavaScript"
  - "WXSS"
  - "微信云开发"
repository:
  type: "git"
  url: "https://github.com/firecangshu/zhicetong.git"
  branch: "dev-v2.3"
```

#### 文件 2：`gpqs/domain_knowledge.yaml`

```yaml
# 领域知识清单 / Domain Knowledge Checklist
knowledge_items:
  - id: "DK001"
    statement: "文旅项目选址需符合《旅游规划通则》（GB/T 18972-2017）"
    source_type: "national_standard"
    rarity: "high"
    practicality: "high"
    actionability: "high"
    reusability: "high"
    how_it_changes_agent_behavior: "在 W2 资源盘点阶段，自动对照国标条目进行核查"
    evidence:
      level: "E3"
      description: "已在 3 个真实项目中验证"
  
  - id: "DK002"
    statement: "文旅项目需考虑季节性影响（旺季/淡季客流差异）"
    source_type: "expert_experience"
    rarity: "medium"
    practicality: "high"
    actionability: "medium"
    reusability: "high"
    how_it_changes_agent_behavior: "在 W4 市场调研阶段，自动加入季节性分析维度"
    evidence:
      level: "E2"
      description: "已在内部测试中验证"
```

#### 文件 3：`gpqs/functionality_checklist.yaml`

```yaml
# 功能完整性清单 / Functionality Checklist
modules:
  - id: "M001"
    name: "W1 地块选择"
    description: "输入目标城市，系统推荐适宜文旅开发的地块"
    status: "implemented"
    test_status: "partial"
    test_coverage: "60%"
  
  - id: "M002"
    name: "W2 资源盘点"
    description: "AI 自动读取地块 1km 半径内的文旅资源"
    status: "implemented"
    test_status: "partial"
    test_coverage: "60%"
  
  - id: "M003"
    name: "W3 政策引导"
    description: "获取地块相关的政策红利（招商引资政策）"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M004"
    name: "W4 市场调研"
    description: "分析目标城市的文旅市场供需情况"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M005"
    name: "W5 法规红线"
    description: "合规性检查（永久基本农田、生态保护红线等）"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M006"
    name: "W6 竞品分析"
    description: "分析地块 3km 半径内的竞品项目"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M007"
    name: "W7 需求澄清"
    description: "AI 多轮对话澄清投资方核心诉求"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M008"
    name: "W8 战略定位"
    description: "输出地块战略定位语"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
  
  - id: "M009"
    name: "W9 成果输出"
    description: "输出三向成果（定位语、功能组合、游线规划）"
    status: "implemented"
    test_status: "none"
    test_coverage: "0%"
```

#### 文件 4：`gpqs/test_coverage.yaml`

```yaml
# 测试覆盖率报告 / Test Coverage Report
test_status: "partial"  # none / partial / complete
test_tools:
  - name: "无"
    version: "-"
    coverage: "0%"
unit_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
integration_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
e2e_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
validation_level: "V1"  # V0-V5
validation_description: "无验证（代码写完就上线）"
```

#### 文件 5：`gpqs/maintainability.yaml`

```yaml
# 可维护性评估 / Maintainability Assessment
code_quality:
  cyclomatic_complexity:
    average: "15"  # 平均圈复杂度
    max: "30"       # 最高圈复杂度
    threshold: "10"  # 建议阈值
    status: "needs_improvement"
  duplication:
    percentage: "5%"
    status: "good"
  documentation:
    inline_comments: "partial"
    api_docs: "none"
    readme: "exists"
    status: "needs_improvement"
technical_debt:
  estimated_hours: "40"
  categories:
    - "测试覆盖率低（0%）"
    - "代码复杂度高（平均 15，最高 30）"
    - "缺少 API 文档"
  status: "high"
refactoring_priority:
  - priority: "P0"
    description: "增加单元测试（目标：覆盖率 > 80%）"
  - priority: "P1"
    description: "重构高复杂度函数（目标：圈复杂度 < 10）"
  - priority: "P2"
    description: "添加 API 文档（JSDoc）"
```

#### 文件 6：`gpqs/security_checklist.yaml`

```yaml
# 安全与合规性清单 / Security & Compliance Checklist
data_security:
  - item: "用户隐私数据加密"
    status: "not_implemented"
    priority: "P0"
    description: "用户输入的地块信息、投资预算等隐私数据需要加密存储"
  
  - item: "API 通信加密（HTTPS）"
    status: "implemented"
    priority: "P0"
    description: "所有 API 通信使用 HTTPS 协议"
  
  - item: "敏感数据脱敏"
    status: "not_implemented"
    priority: "P1"
    description: "手机号、身份证号等敏感数据需要脱敏处理"

access_control:
  - item: "用户身份验证"
    status: "not_implemented"
    priority: "P0"
    description: "需要实现用户登录和身份验证（微信登录）"
  
  - item: "权限控制"
    status: "not_implemented"
    priority: "P1"
    description: "不同用户角色需要不同的权限（投资者、规划师、政府人员）"

compliance:
  - item: "数据合规（个人信息保护法）"
    status: "not_implemented"
    priority: "P0"
    description: "需要符合《个人信息保护法》要求"
  
  - item: "开源协议合规"
    status: "not_implemented"
    priority: "P1"
    description: "需要添加 LICENSE 文件，明确开源协议"
  
  - item: "AVJ 安全边界声明"
    status: "not_implemented"
    priority: "P0"
    description: "需要在 W9 成果页添加免责声明"

risk_assessment:
  overall_risk: "high"
  risks:
    - description: "用户隐私数据未加密存储"
      impact: "high"
      probability: "medium"
      mitigation: "使用微信云开发的数据库加密功能"
    
    - description: "缺少安全边界声明，可能被误用"
      impact: "medium"
      probability: "high"
      mitigation: "在 W9 成果页添加免责声明"
```

#### 文件 7：`gpqs/deployment_readiness.yaml`

```yaml
# 上线准备清单 / Deployment Readiness Checklist
environment_config:
  - item: "生产环境配置"
    status: "not_ready"
    description: "需要配置生产环境的 API 端点、数据库连接等"
  
  - item: "环境变量管理"
    status: "not_ready"
    description: "需要使用环境变量管理敏感信息（API Key、数据库密码等）"
  
  - item: "域名和 SSL 证书"
    status: "not_ready"
    description: "需要注册域名并配置 SSL 证书（HTTPS）"

monitoring_alerting:
  - item: "错误监控（Sentry 等）"
    status: "not_implemented"
    priority: "P0"
    description: "需要集成错误监控工具，及时发现线上问题"
  
  - item: "性能监控（APM）"
    status: "not_implemented"
    priority: "P1"
    description: "需要监控 API 响应时间、页面加载时间等"
  
  - item: "用户行为分析（Google Analytics 等）"
    status: "not_implemented"
    priority: "P2"
    description: "需要分析用户行为，优化产品"

rollback_plan:
  - item: "版本管理（Git）"
    status: "ready"
    description: "已使用 Git 进行版本管理，可以回滚到任意版本"
  
  - item: "数据库备份"
    status: "not_ready"
    priority: "P0"
    description: "需要定期备份数据库，防止数据丢失"
  
  - item: "回滚脚本"
    status: "not_ready"
    priority: "P0"
    description: "需要编写回滚脚本，快速恢复到上一个稳定版本"

deployment_checklist:
  - item: "代码审查"
    status: "not_ready"
    description: "上线前需要进行代码审查（Code Review）"
  
  - item: "安全审查"
    status: "not_ready"
    priority: "P0"
    description: "上线前需要进行安全审查（渗透测试、漏洞扫描）"
  
  - item: "性能测试"
    status: "not_ready"
    priority: "P1"
    description: "上线前需要进行性能测试（负载测试、压力测试）"
  
  - item: "用户验收测试（UAT）"
    status: "not_ready"
    priority: "P0"
    description: "上线前需要让真实用户试用，确认功能正常"

overall_readiness: "not_ready"  # not_ready / partially_ready / ready
estimated_hours_to_launch: "80"  # 预计还需 80 小时才能上线
```

---

### 步骤 4：提示用户确认和修改

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

⚠️ 这些是初版文件，基于项目扫描结果自动生成。

请检查并修改这些文件：
1. 补充不准确的信息（如项目类型、维护者名单）
2. 添加缺少的领域知识（domain_knowledge.yaml）
3. 更新功能完整性清单（functionality_checklist.yaml）
4. 配置测试覆盖率（test_coverage.yaml）
5. 评估可维护性（maintainability.yaml）
6. 完成安全与合规性清单（security_checklist.yaml）
7. 完善上线准备清单（deployment_readiness.yaml）

修改完成后，运行「门神评估」开始评分。
```

---

## 输出格式 / Output Format

### 成功输出

```markdown
✅ 门神初始化完成！

已生成以下文件：
- gpqs/project_info.yaml
- gpqs/domain_knowledge.yaml
- gpqs/functionality_checklist.yaml
- gpqs/test_coverage.yaml
- gpqs/maintainability.yaml
- gpqs/security_checklist.yaml
- gpqs/deployment_readiness.yaml

⚠️ 这些是初版文件，基于项目扫描结果自动生成。

请检查并修改这些文件，然后运行「门神评估」。
```

### 错误输出

```markdown
❌ 门神初始化失败！

错误原因：{error_message}

请检查：
1. 项目路径是否正确？
2. 是否有读取权限？
3. 项目目录是否存在？

修复后重试。
```

---

## 后续步骤 / Next Steps

1. **检查并修改 YAML 文件**
   - 打开 `gpqs/` 目录
   - 逐个检查 7 个 YAML 文件
   - 补充不准确的信息

2. **运行「门神评估」**
   - 触发词："门神评估" / "Menshen assess"
   - 门神会读取 `gpqs/` 目录下的 7 个 YAML 文件
   - 运行 GPQS 评分引擎
   - 输出评分报告

3. **根据评分报告改进项目**
   - 查看评分报告中的「主要问题」
   - 按照「改进建议」逐项改进
   - 改进后重新运行「门神评估」，查看分数是否提升

---

## 示例 / Example

### 用户输入

```
用门神初始化我的项目
```

### AI 输出

```
好的，我来帮你用门神初始化项目。

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
✅ 项目扫描完成！

项目类型：微信小程序（WeChat Mini Program）
源代码文件：14 个
测试文件：0 个
文档文件：1 个
配置文件：3 个

检测到的问题：
- [P0] 没有测试文件
- [P1] 缺少 LICENSE 文件
- [P2] 文档不完整（只有 README.md）

正在生成 YAML 文件...

✅ 门神初始化完成！

已生成以下文件：
- gpqs/project_info.yaml
- gpqs/domain_knowledge.yaml
- gpqs/functionality_checklist.yaml
- gpqs/test_coverage.yaml
- gpqs/maintainability.yaml
- gpqs/security_checklist.yaml
- gpqs/deployment_readiness.yaml

⚠️ 这些是初版文件，基于项目扫描结果自动生成。

请检查并修改这些文件，然后运行「门神评估」。
```

---

## 来源 / Origin

本工作流基于 [GPQS (General Project Quality Standard)](https://github.com/firecangshu/gpqs-standard) 实现。

GPQS 基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创。

---

## 许可证 / License

MIT License
