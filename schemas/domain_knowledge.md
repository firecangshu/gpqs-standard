# 领域知识清单格式规范 V1.0

本文档定义 `domain_knowledge.yaml` 的格式规范。

---

## 用途

`domain_knowledge.yaml` 用于记录项目沉淀的领域知识（业务规则、行业规范、最佳实践）。

---

## 格式规范

```yaml
# 领域知识清单 / Domain Knowledge Checklist
domain: "领域名称 / Domain Name"
domain_en: "Domain Name in English"

# 知识条目 / Knowledge Items
knowledge_items:
  - id: "DK001"
    statement: "知识陈述 / Knowledge statement"
    statement_en: "Knowledge statement in English"
    source: "来源 / Source"
    source_type: "official_doc"  # 可选值：official_doc, expert_opinion, data_analysis, case_study, other
    practicality: "high"  # 可选值：high, medium, low
    reusability: "high"  # 可选值：high, medium, low
    how_it_changes_behavior: "如何改变项目行为 / How it changes project behavior"
    how_it_changes_behavior_en: "How it changes project behavior in English"
    evidence:
      level: "V3"  # 可选值：V0, V1, V2, V3, V4, V5
      description: "证据描述 / Evidence description"
      description_en: "Evidence description in English"

# 专家经验（可选）/ Expert Experience (Optional)
expert_experience:
  - id: "EXP001"
    description: "专家经验描述 / Expert experience description"
    description_en: "Expert experience description in English"
    expert_name: "专家姓名 / Expert Name"
    date: "2026-06-18"

# 放大专家能力（可选）/ Amplify Expert Capability (Optional)
amplify_expert:
  enabled: true  # true / false
  description: "如何放大专家能力 / How to amplify expert capabilties"
  description_en: "How to amplify expert capabilties in English"
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `domain` | string | 是 | 领域名称（中文） |
| `domain_en` | string | 否 | 领域名称（英文） |
| `knowledge_items` | array | 是 | 知识条目列表 |
| `knowledge_items[].id` | string | 是 | 知识 ID（唯一） |
| `knowledge_items[].statement` | string | 是 | 知识陈述（中文） |
| `knowledge_items[].statement_en` | string | 否 | 知识陈述（英文） |
| `knowledge_items[].source` | string | 是 | 来源 |
| `knowledge_items[].source_type` | string | 是 | 来源类型（见下文） |
| `knowledge_items[].practicality` | string | 是 | 实操性（见下文） |
| `knowledge_items[].reusability` | string | 是 | 可复用性（见下文） |
| `knowledge_items[].how_it_changes_behavior` | string | 是 | 如何改变项目行为（中文） |
| `knowledge_items[].how_it_changes_behavior_en` | string | 否 | 如何改变项目行为（英文） |
| `knowledge_items[].evidence` | object | 是 | 证据 |
| `knowledge_items[].evidence.level` | string | 是 | 证据等级（V0-V5） |
| `knowledge_items[].evidence.description` | string | 是 | 证据描述（中文） |
| `knowledge_items[].evidence.description_en` | string | 否 | 证据描述（英文） |
| `expert_experience` | array | 否 | 专家经验列表（可选） |
| `amplify_expert` | object | 否 | 放大专家能力（可选） |

---

## 来源类型（source_type）

| 值 | 说明 |
|-----|------|
| `official_doc` | 官方文档 |
| `expert_opinion` | 专家意见 |
| `data_analysis` | 数据分析 |
| `case_study` | 案例研究 |
| `other` | 其他 |

---

## 实操性（practicality）

| 值 | 说明 |
|-----|------|
| `high` | 高（可直接执行） |
| `medium` | 中（需要部分调整） |
| `low` | 低（需要大量调整） |

---

## 可复用性（reusability）

| 值 | 说明 |
|-----|------|
| `high` | 高（适用于多个项目） |
| `medium` | 中（适用于同类项目） |
| `low` | 低（只适用于当前项目） |

---

## JSON Schema 验证

见 `schemas/domain_knowledge.yaml.schema.json`。

---

**最后更新**：2026-06-18
**维护人**：firecangshu
