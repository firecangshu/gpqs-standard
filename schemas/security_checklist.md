# 安全与合规性清单格式规范 V1.0

---

## 用途

记录项目安全检查项、合规要求、风险控制措施。

---

## 格式规范

```yaml
# 安全与合规性清单 / Security & Compliance Checklist
items:
  - id: "SEC001"
    name: "数据加密 / Data Encryption"
    name_en: "Data Encryption"
    description: "敏感数据是否加密存储和传输。"
    status: "passed"  # passed | failed | not_checked
    risk_level: "high"  # high | medium | low
    mitigation: "缓解措施 / Mitigation measures"

# 整体安全评分 / Overall Security Score
overall_security_score: 85  # 0-100
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `items` | array | 是 | 安全检查项列表 |
| `items[].id` | string | 是 | 检查项 ID |
| `items[].name` | string | 是 | 检查项名称（中文） |
| `items[].name_en` | string | 否 | 检查项名称（英文） |
| `items[].description` | string | 是 | 检查项描述 |
| `items[].status` | string | 是 | 检查状态（见下文） |
| `items[].risk_level` | string | 是 | 风险等级（见下文） |
| `items[].mitigation` | string | 否 | 缓解措施 |
| `overall_security_score` | number | 是 | 整体安全评分（0-100） |

---

## 检查状态（status）

| 值 | 说明 |
|-----|------|
| `passed` | 通过 |
| `failed` | 未通过 |
| `not_checked` | 未检查 |

---

## 风险等级（risk_level）

| 值 | 说明 |
|-----|------|
| `high` | 高风险（必须修复） |
| `medium` | 中风险（建议修复） |
| `low` | 低风险（可选修复） |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
