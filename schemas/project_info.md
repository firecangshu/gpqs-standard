# 项目基本信息格式规范 V1.0

本文档定义 `project_info.yaml` 的格式规范。

---

## 用途

`project_info.yaml` 用于记录项目的基本信息，包括项目名称、版本、技术栈、负责人等。

---

## 格式规范

```yaml
# 项目基本信息 / Project Basic Information
project_name: "项目中文名称"
project_name_en: "Project English Name"
version: "v1.0.0"
description: |
  项目中文描述。
  Project description in Chinese.
description_en: |
  Project description in English.

# 技术栈 / Tech Stack
tech_stack:
  - "技术 1 / Tech 1"
  - "技术 2 / Tech 2"

# 负责人 / Owner
owner:
  name: "负责人姓名 / Owner Name"
  email: "email@example.com"
  role: "负责人角色 / Owner Role"

# 项目类型 / Project Type
project_type: "web_app"  # 可选值：web_app, mobile_app, desktop_app, ai_agent, other

# 创建日期 / Creation Date
created_date: "2026-01-01"

# 最后更新日期 / Last Updated Date
last_updated: "2026-06-18"

# GPQS 评估结果 / GPQS Assessment Result
gpqs_score:
  total: 85  # 总分（0-100）
  dimension_1: 18  # 维度 ① 得分（0-20）
  dimension_2: 23  # 维度 ② 得分（0-25）
  dimension_3: 16  # 维度 ③ 得分（0-20）
  dimension_4: 13  # 维度 ④ 得分（0-15）
  dimension_5: 4   # 维度 ⑤ 得分（0-5）
  dimension_6: 4   # 维度 ⑥ 得分（0-5）
  dimension_7: 9   # 维度 ⑦ 得分（0-10）
  assessment_date: "2026-06-18"
  assessor: "评估人 / Assessor"
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `project_name` | string | 是 | 项目中文名称 |
| `project_name_en` | string | 否 | 项目英文名称 |
| `version` | string | 是 | 项目版本号（语义化版本） |
| `description` | string | 是 | 项目中文描述 |
| `description_en` | string | 否 | 项目英文描述 |
| `tech_stack` | array | 是 | 技术栈列表 |
| `owner` | object | 是 | 负责人信息 |
| `owner.name` | string | 是 | 负责人姓名 |
| `owner.email` | string | 是 | 负责人邮箱 |
| `owner.role` | string | 否 | 负责人角色 |
| `project_type` | string | 是 | 项目类型（见下文） |
| `created_date` | string | 是 | 创建日期（YYYY-MM-DD） |
| `last_updated` | string | 是 | 最后更新日期（YYYY-MM-DD） |
| `gpqs_score` | object | 否 | GPQS 评估结果 |
| `gpqs_score.total` | number | 否 | 总分（0-100） |
| `gpqs_score.dimension_1` ~ `dimension_7` | number | 否 | 各维度得分 |
| `gpqs_score.assessment_date` | string | 否 | 评估日期 |
| `gpqs_score.assessor` | string | 否 | 评估人 |

---

## 项目类型（project_type）

| 值 | 说明 |
|-----|------|
| `web_app` | Web 应用 |
| `mobile_app` | 移动应用 |
| `desktop_app` | 桌面应用 |
| `ai_agent` | AI Agent |
| `other` | 其他 |

---

## JSON Schema 验证

见 `schemas/project_info.yaml.schema.json`。

---

**最后更新**：2026-06-18
**维护人**：firecangshu
