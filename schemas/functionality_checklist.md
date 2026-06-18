# 功能完整性清单格式规范 V1.0

本文档定义 `functionality_checklist.yaml` 的格式规范。

---

## 用途

记录项目功能模块的完成状态、可靠性、测试方法。

---

## 格式规范

```yaml
# 功能完整性清单 / Functionality Completeness Checklist
modules:
  - id: "M001"
    name: "模块名称 / Module Name"
    name_en: "Module Name in English"
    description: "模块描述 / Module description"
    status: "complete"  # complete | partial | not_started
    reliability: 99  # 0-100，表示可靠性百分比
    test_coverage: 85  # 0-100，表示测试覆盖率百分比
    test_method: "测试方法 / Test method"
    error_handling: true  # 是否有错误处理 / Whether has error handling

# 整体可靠性 / Overall Reliability
overall_reliability: 95  # 0-100
```

---

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modules` | array | 是 | 功能模块列表 |
| `modules[].id` | string | 是 | 模块 ID |
| `modules[].name` | string | 是 | 模块名称（中文） |
| `modules[].name_en` | string | 否 | 模块名称（英文） |
| `modules[].description` | string | 是 | 模块描述 |
| `modules[].status` | string | 是 | 完成状态（见下文） |
| `modules[].reliability` | number | 是 | 可靠性（0-100%） |
| `modules[].test_coverage` | number | 是 | 测试覆盖率（0-100%） |
| `modules[].test_method` | string | 是 | 测试方法 |
| `modules[].error_handling` | boolean | 是 | 是否有错误处理 |
| `overall_reliability` | number | 是 | 整体可靠性（0-100%） |

---

## 完成状态（status）

| 值 | 说明 |
|-----|------|
| `complete` | 已完成 |
| `partial` | 部分完成 |
| `not_started` | 未开始 |

---

**最后更新**：2026-06-18
**维护人**：firecangshu
