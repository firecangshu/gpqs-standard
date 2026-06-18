# 上线准备清单格式规范 V1.0

---

## 用途

记录项目上线前的准备项、环境配置、监控告警、回滚方案。

---

## 格式规范

```yaml
# 上线准备清单 / Deployment Readiness Checklist
items:
  - id: "DEP001"
    name: "环境配置 / Environment Configuration"
    name_en: "Environment Configuration"
    description: "生产环境是否已正确配置。"
    status: "passed"  # passed | failed | not_checked
    priority: "high"  # high | medium | low

  - id: "DEP002"
    name: "监控告警 / Monitoring & Alerting"
    name_en: "Monitoring & Alerting"
    description: "是否已配置监控和告警。"
    status: "passed"
    priority: "high"

  - id: "DEP003"
    name: "回滚方案 / Rollback Plan"
    name_en: "Rollback Plan"
    description: "是否有完整的回滚方案。"
    status: "passed"
    priority: "high"

# 整体准备度 / Overall Readiness
overall_readiness: 90  # 0-100
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `items` | array | 是 | 准备项列表 |
| `items[].id` | string | 是 | 准备项 ID |
| `items[].name` | string | 是 | 准备项名称（中文） |
| `items[].name_en` | string | 否 | 准备项名称（英文） |
| `items[].description` | string | 是 | 准备项描述 |
| `items[].status` | string | 是 | 准备状态（见下文） |
| `items[].priority` | string | 是 | 优先级（见下文） |
| `overall_readiness` | number | 是 | 整体准备度（0-100） |

---

## 准备状态（status）

| 值 | 说明 |
|-----|------|
| `passed` | 通过 |
| `failed` | 未通过 |
| `not_checked` | 未检查 |

---

## 优先级（priority）

| 值 | 说明 |
|-----|------|
| `high` | 高（必须完成） |
| `medium` | 中（建议完成） |
| `low` | 低（可选完成） |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
