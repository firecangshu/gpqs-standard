# GPQS Standard V1.0 (English)

GPQS (General Project Quality Standard) is an open-source project quality assessment framework, suitable for standardized assessment of all software projects before launch.

---

## 1. Scoring Dimensions (7 Dimensions, Total 100 Points)

### Dimension 1: Domain Knowledge Completeness (20 Points)

**Definition**: Whether the project has accumulated sufficient domain knowledge (business rules, industry standards, best practices).

**Scoring Criteria**:
- **Excellent (16-20 points)**: 10+ domain knowledge items, each with clear source and practicality assessment
- **Good (11-15 points)**: 5-9 domain knowledge items, most with clear sources
- **Pass (6-10 points)**: 2-4 domain knowledge items, some with clear sources
- **Fail (0-5 points)**: No domain knowledge items, or items without clear sources

**Verification**: Check `domain_knowledge.yaml` file

---

### Dimension 2: Functionality Completeness & Reliability (25 Points)

**Definition**: Whether the project's functionality is complete, reliable, and fully tested.

**Scoring Criteria**:
- **Excellent (21-25 points)**: Functionality completeness 90%+, reliability 99%+, has error handling
- **Good (16-20 points)**: Functionality completeness 70-89%, reliability 95-98%, has basic error handling
- **Pass (11-15 points)**: Functionality completeness 50-69%, reliability 90-94%, has simple error handling
- **Fail (0-10 points)**: Functionality completeness < 50%, reliability < 90%, no error handling

**Verification**: Check `functionality_checklist.yaml` file

---

### Dimension 3: Test Coverage & Validation Strength (20 Points)

**Definition**: Whether the project's testing is sufficient, and whether it has been validated in real environment.

**Scoring Criteria**:
- **V5 (20 points)**: Production environment validation (A/B testing, online monitoring)
- **V4 (16 points)**: User acceptance testing (Beta testing, gray release)
- **V3 (12 points)**: System testing (coverage > 80%)
- **V2 (8 points)**: Integration testing (coverage 50-80%)
- **V1 (4 points)**: Unit testing (coverage < 50%)
- **V0 (0 points)**: No validation

**Verification**: Check `test_coverage.yaml` file

---

### Dimension 4: Maintainability & Iteration Capability (15 Points)

**Definition**: Whether the project is easy to maintain and iterate, and whether it has technical debt management.

**Scoring Criteria**:
- **Excellent (13-15 points)**: Low code complexity, complete documentation, low technical debt, has iteration plan
- **Good (9-12 points)**: Medium code complexity, basic complete documentation, controllable technical debt
- **Pass (5-8 points)**: High code complexity, incomplete documentation, high technical debt
- **Fail (0-4 points)**: Extremely high code complexity, no documentation, serious technical debt

**Verification**: Check `maintainability.yaml` file

---

### Dimension 5: User Adaptation & Personalization (5 Points, Optional)

**Definition**: Whether the project supports personalization, and whether it can adjust behavior according to user, task, and environment.

**Scoring Criteria**:
- **Excellent (5 points)**: Supports personalization, can automatically adjust according to user, task, and environment
- **Good (3-4 points)**: Supports partial personalization, requires manual configuration
- **Pass (1-2 points)**: Supports basic personalization, but functionality is limited
- **Fail (0 points)**: Does not support personalization

**Verification**: Check `user_adaptation.yaml` file (if exists)

---

### Dimension 6: Business Value & Expert Experience Accumulation (5 Points, Optional)

**Definition**: Whether the project has accumulated expert experience, and whether it can amplify expert capabilities.

**Scoring Criteria**:
- **Excellent (5 points)**: Accumulated expert experience, can amplify expert capabilities, lower门槛 for later comers
- **Good (3-4 points)**: Partially accumulated expert experience, can partially amplify expert capabilities
- **Pass (1-2 points)**: Small amount of accumulated expert experience, limited ability to amplify expert capabilities
- **Fail (0 points)**: No expert experience accumulated

**Verification**: Check `expert_experience` field in `domain_knowledge.yaml` file

---

### Dimension 7: Security & Compliance (10 Points)

**Definition**: Whether the project is secure, compliant, and has risk control measures.

**Scoring Criteria**:
- **Excellent (9-10 points)**: Complete security checklist (10+ items), all items passed
- **Good (6-8 points)**: Basic security checklist (5-9 items), most items passed
- **Pass (3-5 points)**: Simple security checklist (< 5 items), some items passed
- **Fail (0-2 points)**: No security checklist, or critical items not passed

**Verification**: Check `security_checklist.yaml` file

---

## 2. Validation Strength Levels (V0-V5)

| Level | Name | Definition | Example |
|-------|------|------------|---------|
| V0 | No Validation | Not tested at all | Deploy code immediately after writing |
| V1 | Unit Testing | Has unit tests, but low coverage (< 50%) | Only core functions have tests |
| V2 | Integration Testing | Has integration tests, medium coverage (50-80%) | API tests, database tests |
| V3 | System Testing | Has system tests, covers main functionality (> 80%) | E2E tests, UI tests |
| V4 | User Acceptance Testing | Has real user participation in testing | Beta testing, gray release |
| V5 | Production Environment Validation | Validated in production environment, has monitoring and logs | A/B testing, online monitoring |

---

## 3. Project Quality Checklist Format (7 YAML Files)

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

---

## 4. Scoring Process

1. **Generate project quality checklist**: Run `npm run init -- --project-path ./your-project`
2. **Fill in YAML files**: Fill in 7 YAML files according to project actual situation
3. **Score**: Run `npm run score -- --project-path ./your-project --lang en`
4. **View report**: Open `your-project/gpqs/score-report.html`

---

## 5. CI/CD Integration

### GitHub Actions Example

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
      - run: npm run score -- --project-path . --lang en
      - uses: actions/upload-artifact@v3
        with:
          name: gpqs-score-report
          path: gpqs/score-report.html
```

---

## 6. Version History

| Version | Date | Changes |
|---------|------|---------|
| V1.0 | 2026-06-18 | Initial version, forked from AVJ V0.1 |

---

**Last Updated**: 2026-06-18
**Maintainer**: firecangshu
