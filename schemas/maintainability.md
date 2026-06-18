# 可维护性评估格式规范 V1.0

---

## 用途

记录项目代码质量、文档完整性、技术债务、迭代计划。

---

## 格式规范

```yaml
# 可维护性评估 / Maintainability Assessment
code_complexity: "low"  # low | medium | high | very_high

documentation_completeness: "complete"  # complete | basic | partial | none

technical_debt:
  level: "low"  # none | low | medium | high | very_high
  description: "技术债务描述 / Technical debt description"
  repayment_plan: "偿还计划 / Repayment plan"

iteration_plan:
  has_plan: true
  next_milestone: "下一里程碑 / Next milestone"
  date: "2026-07-01"

# 代码质量指标（可选）/ Code Quality Metrics (Optional)
code_quality:
  cyclomatic_complexity: 4.5  # 平均圈复杂度
  lines_of_code: 5000
  test_coverage: 75  # %
  duplicate_rate: 3  # %
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code_complexity` | string | 是 | 代码复杂度（见下文） |
| `documentation_completeness` | string | 是 | 文档完整度（见下文） |
| `technical_debt.level` | string | 是 | 技术债务等级（见下文） |
| `technical_debt.description` | string | 否 | 技术债务描述 |
| `technical_debt.repaymentPlan` | string | 否 | 偿还计划 |
| `iteration_plan.has_plan` | boolean | 是 | 是否有迭代计划 |
| `iteration_plan.next_milestone` | string | 否 | 下一里程碑 |
| `iteration_plan.date` | string | 否 | 预计日期 |

---

## 代码复杂度（code_complexity）

| 值 | 说明 |
|-----|------|
| `low` | 低（平均圈复杂度 < 5） |
| `medium` | 中（平均圈复杂度 5-10） |
| `high` | 高（平均圈复杂度 10-20） |
| `very_high` | 极高（平均圈复杂度 > 20） |

---

## 文档完整度（documentation_completeness）

| 值 | 说明 |
|-----|------|
| `complete` | 完整（README + API 文档 + 架构文档） |
| `basic` | 基本完整（README + API 文档） |
| `partial` | 部分完整（只有 README） |
| `none` | 无文档 |

---

## 技术债务等级（technical_debt.level）

| 值 | 说明 |
|-----|------|
| `none` | 无技术债务 |
| `low` | 少量技术债务，可控 |
| `medium` | 中等技术债务，需计划 |
| `high` | 大量技术债务，需优先处理 |
| `very_high` | 严重技术债务，影响维护 |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
