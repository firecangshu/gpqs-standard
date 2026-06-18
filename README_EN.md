# GPQS (General Project Quality Standard)

> An open-source project quality assessment standard, forked from [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge).

[中文](README.md) | [Modifications](MODIFICATIONS_EN.md) | [Contributing](CONTRIBUTING_EN.md)

---

## Project Introduction

**GPQS (General Project Quality Standard)** is an open-source project quality assessment framework, suitable for standardized assessment of all software projects before launch.

**Core Concepts**:
- ✅ **General-purpose**: Removed AI Agent-specific metrics, changed to general software project quality assessment
- ✅ **Quantifiable**: All dimensions are scorable (0-100 points)
- ✅ **Traceable**: All scoring results are archived, supporting audit and review
- ✅ **Bilingual**: All documents, UI, and outputs support both Chinese and English

**Relationship with AVJ**:
- This project is forked from [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge)
- We respect the original work and have marked the source at all key locations
- Detailed modifications can be found in [MODIFICATIONS_EN.md](MODIFICATIONS_EN.md)

---

## Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/firecangshu/gpqs-standard.git
cd gpqs-standard

# Install dependencies
npm install  # or use pnpm
```

### 2. Assess Your Project

```bash
# Generate project quality checklist
npm run init -- --project-path ./your-project

# Score
npm run score -- --project-path ./your-project --lang en

# Output HTML report
npm run score -- --project-path ./your-project --output html --lang en
```

### 3. View Scoring Results

Scoring results are saved in `your-project/gpqs/score-report.html`, open it in a browser.

---

## Scoring Dimensions

GPQS includes 7 scoring dimensions (total 100 points):

| Dimension | Weight | Description |
|-----------|--------|-------------|
| ① Domain Knowledge Completeness | 20% | Whether the project has accumulated sufficient domain knowledge |
| ② Functionality Completeness & Reliability | 25% | Whether the project's functionality is complete and reliable |
| ③ Test Coverage & Validation Strength | 20% | Whether the project's testing is sufficient |
| ④ Maintainability & Iteration Capability | 15% | Whether the project is easy to maintain and iterate |
| ⑤ User Adaptation & Personalization | 5% | Whether the project supports personalization (optional dimension) |
| ⑥ Business Value & Expert Experience Accumulation | 5% | Whether the project has accumulated expert experience (optional dimension) |
| ⑦ Security & Compliance | 10% | Whether the project is secure and compliant |

Detailed scoring rules can be found in [docs/scoring_rules_en.md](docs/scoring_rules_en.md).

---

## Project Quality Checklist

Each project needs to create a `gpqs/` directory and fill in the following 7 YAML files:

| File Name | Purpose | Schema |
|-----------|---------|-------|
| `project_info.yaml` | Project basic information | [schema](schemas/project_info.yaml.schema.json) |
| `domain_knowledge.yaml` | Domain knowledge checklist | [schema](schemas/domain_knowledge.yaml.schema.json) |
| `functionality_checklist.yaml` | Functionality completeness checklist | [schema](schemas/functionality_checklist.yaml.schema.json) |
| `test_coverage.yaml` | Test coverage report | [schema](schemas/test_coverage.yaml.schema.json) |
| `maintainability.yaml` | Maintainability assessment | [schema](schemas/maintainability.yaml.schema.json) |
| `security_checklist.yaml` | Security & compliance checklist | [schema](schemas/security_checklist.yaml.schema.json) |
| `deployment_readiness.yaml` | Deployment readiness checklist | [schema](schemas/deployment_readiness.yaml.schema.json) |

Example files can be found in [examples/](examples/).

---

## Tools

GPQS provides the following tools:

| Tool | Purpose | Location |
|------|---------|----------|
| CLI Tool | Command-line scoring | [tools/cli/](tools/cli/) |
| Web Interface | Online scoring | [tools/web/](tools/web/) |
| CI/CD Plugin | Integration with GitHub Actions | [tools/ci/](tools/ci/) |

---

## Contributing

Contributions are welcome! See [CONTRIBUTING_EN.md](CONTRIBUTING_EN.md).

---

## License

[MIT License](LICENSE)

---

## Acknowledgments

This project is forked from [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge), thanks to [team_kaixin](https://gitcode.com/team_kaixin) for the pioneering work.

---
