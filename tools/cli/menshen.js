#!/usr/bin/env node

/**
 * 门神 CLI 入口 / Menshen CLI Entry Point
 *
 * 命令：
 *   node menshen.js init --project-path <path>
 *   node menshen.js assess --project-path <path> [--lang zh|en] [--output console|json|html|markdown]
 *   node menshen.js ci --project-path <path> [--threshold 60]
 *
 * 基于 GPQS V1.0 标准实现。
 * GPQS 基于 AVJ (Agent Value Judgment) 二创。
 */

const fs = require('fs');
const path = require('path');
const { assess } = require('./assess.js');

// ─────────────────────────────
// 命令行参数解析
// ─────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  const params = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = (args[i + 1] && !args[i + 1].startsWith('--')) ? args[i + 1] : true;
      params[key] = value;
      if (value !== true) i++;
    }
  }

  params['project-path'] = params['project-path'] || process.cwd();
  params.lang = params.lang || 'zh';
  params.output = params.output || 'console';
  params.threshold = parseInt(params.threshold) || 60;

  return { command, params };
}

// ─────────────────────────────
// init 命令：生成 7 个 YAML 模板
// ─────────────────────────────

function initProject(params) {
  const lb = (zh, en) => params.lang === 'zh' ? zh : en;
  const projectPath = path.resolve(params['project-path']);

  console.log(`📂 ${lb('项目路径', 'Project path')}: ${projectPath}\n`);

  if (!fs.existsSync(projectPath)) {
    throw new Error(lb('项目路径不存在', 'Project path does not exist') + ': ' + projectPath);
  }

  const gpqsDir = path.join(projectPath, '.gpqs');
  if (!fs.existsSync(gpqsDir)) {
    fs.mkdirSync(gpqsDir, { recursive: true });
    console.log(`  ✅ ${lb('创建目录', 'Create directory')}：.gpqs/`);
  }

  const templates = getYamlTemplates(params.lang);
  const files = Object.keys(templates);

  console.log(`\n📄 ${lb('生成 YAML 模板', 'Generating YAML templates')}...\n`);

  let created = 0;
  for (const file of files) {
    const filePath = path.join(gpqsDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ⚠️  ${file} ${lb('已存在（跳过）', '(exists, skipped)')}`);
      continue;
    }
    fs.writeFileSync(filePath, templates[file], 'utf8');
    console.log(`  ✅ ${file}`);
    created++;
  }

  console.log(`\n✅ ${lb('门神初始化完成！', 'Menshen init complete!')}`);
  console.log(lb('请编辑 .gpqs/ 目录下的文件，然后运行：', 'Edit files in .gpqs/, then run:'));
  console.log(`  node menshen.js assess --project-path "${projectPath}"\n`);
}

function getYamlTemplates(lang) {
  const lb = (zh, en) => lang === 'zh' ? zh : en;
  
  return {
    // ========== AVJ 标准 7 个文件 ==========
    'project_info.yaml': `# ${lb('项目基本信息', 'Project Basic Info')}
project_name: "My Project"
project_name_en: "My Project"
version: "v1.0.0"
project_type: "workflow_agent"  # ${lb('5 种类型之一', 'one of 5 types')}: task_agent / workflow_agent / capability_layer / practice_transform / civilization_tool
domain: "${lb('我的领域', 'My Domain')}"
domain_en: "My Domain"
description: |
  ${lb('项目描述。', 'Project description.')}
maintainers:
  - name: "${lb('维护者姓名', 'Maintainer Name')}"
    role: "${lb('角色', 'Role')}"
    email: "dev@example.com"
tech_stack:
  - "Node.js"
  - "React"
repository:
  type: "git"
  url: ""
  branch: "main"
`,

    'domain_knowledge.yaml': `# ${lb('领域知识清单', 'Domain Knowledge Checklist')}
knowledge_items:
  # ${lb('示例：', 'Example:')}
  # - id: "DK001"
  #   statement: "${lb('领域规则描述', 'Domain rule description')}"
  #   source_type: "expert_experience"  # expert_experience / official_doc / case_study / regulation
  #   rarity: "high"  # high / medium / low
  #   practicality: "high"  # high / medium / low
  #   actionability: "high"  # high / medium / low
  #   reusability: "high"  # high / medium / low
  #   how_it_changes_agent_behavior: "${lb('改变行为的描述', 'Description of behavior change')}"
  #   evidence:
  #     level: "V1"  # V0 / V1 / V2 / V3 / V4 / V5
  #     description: "${lb('证据描述', 'Evidence description')}"
`,

    'functionality_checklist.yaml': `# ${lb('功能清单与状态', 'Functionality Checklist')}
modules:
  # ${lb('示例：', 'Example:')}
  # - id: "M001"
  #   name: "${lb('模块名称', 'Module name')}"
  #   description: "${lb('模块描述', 'Module description')}"
  #   status: "complete"  # complete / partial / not_started
  #   critical: true
reliability: 99.9  # ${lb('可靠性（百分比）', 'Reliability (percentage)')}
`,

    'test_coverage.yaml': `# ${lb('测试覆盖率', 'Test Coverage')}
validation_level: "V0"  # V0 / V1 / V2 / V3 / V4 / V5
coverage_rate: 0  # ${lb('覆盖率（百分比）', 'Coverage rate (percentage)')}
`,

    'maintainability.yaml': `# ${lb('可维护性', 'Maintainability')}
code_complexity: 999  # ${lb('代码复杂度（Cyclomatic Complexity）', 'Code complexity (Cyclomatic Complexity)')}
documentation_completeness: "${lb('README + API + 架构', 'README + API + Architecture')}"
technical_debt: "severe"  # none / low / manageable / moderate / severe
`,

    'security_checklist.yaml': `# ${lb('安全清单', 'Security Checklist')}
items:
  # ${lb('示例：', 'Example:')}
  # - id: "S001"
  #   name: "${lb('安全项名称', 'Security item name')}"
  #   critical: true
  #   status: "passed"  # passed / failed / not_checked
`,

    'deployment_readiness.yaml': `# ${lb('部署就绪度', 'Deployment Readiness')}
ready: false
missing_items: []
`,

    // ========== GPQS 扩展文件 ==========
    'feedback_loop.yaml': `# ${lb('反馈循环设计', 'Feedback Loop Design')}
has_feedback_loop: false
has_explicit_correction_mechanism: false
has_self_reflection: false
has_user_feedback_collection: false
has_versioned_improvement: false
has_ab_testing: false
has_offline_evaluation: false

# ${lb('如果以上任何一项为 true，请描述：', 'If any of the above is true, describe:')}
description: "${lb('描述反馈循环的设计', 'Describe feedback loop design')}"
`,

    'domain_prior_ledger.yaml': `# ${lb('领域先验台账', 'Domain Prior Ledger')}
priors:
  # ${lb('示例：', 'Example:')}
  # - id: "PR001"
  #   name: "${lb('先验名称', 'Prior name')}"
  #   description: "${lb('先验描述', 'Prior description')}"
  #   source: "${lb('来源', 'Source')}"
  #   confidence: 0.8  # 0.0 - 1.0
  #   evidence:
  #     level: "V1"
  #     description: "${lb('证据描述', 'Evidence description')}"
`,

    'adversarial_robustness.yaml': `# ${lb('对抗鲁棒性', 'Adversarial Robustness')}
has_adversarial_testing: false
has_edge_case_handling: false
has_input_validation: false
has_output_verification: false

# ${lb('如果以上任何一项为 true，请描述：', 'If any of the above is true, describe:')}
description: "${lb('描述对抗鲁棒性的设计', 'Describe adversarial robustness design')}"
`,

    'evaluation_evidence.md': `# ${lb('评估证据', 'Evaluation Evidence')}

## ${lb('领域知识验证', 'Domain Knowledge Verification')}

${lb('描述如何验证领域知识的正确性。', 'Describe how to verify domain knowledge correctness.')}

## ${lb('功能完整性验证', 'Functionality Completeness Verification')}

${lb('描述如何验证功能完整性。', 'Describe how to verify functionality completeness.')}

## ${lb('测试覆盖率验证', 'Test Coverage Verification')}

${lb('描述如何验证测试覆盖率。', 'Describe how to verify test coverage.')}

## ${lb('安全验证', 'Security Verification')}

${lb('描述如何验证安全性。', 'Describe how to verify security.')}
`,

    'README.md': `# ${lb('门神评估说明', 'Menshen Assessment README')}

${lb('本项目使用门神 (Menshen) 进行质量门禁检查。', 'This project uses Menshen for quality gate checking.')}

## ${lb('快速开始', 'Quick Start')}

1. ${lb('安装依赖', 'Install dependencies')}：\`npm install\`
2. ${lb('初始化', 'Initialize')}：\`node menshen.js init --project-path .\`
3. ${lb('编辑 YAML 文件', 'Edit YAML files')}：\`vi .gpqs/*.yaml\`
4. ${lb('运行评估', 'Run assessment')}：\`node menshen.js assess --project-path .\`

## ${lb('评估报告', 'Assessment Report')}

${lb('评估完成后，报告将生成在', 'After assessment, report will be generated at')}：
- ${lb('控制台输出', 'Console output')}：\`--output console\`
- JSON：\`--output json\`
- HTML：\`--output html\`
- Markdown：\`--output markdown\`

## ${lb('CI/CD 集成', 'CI/CD Integration')}

${lb('在 CI/CD 管道中使用：', 'Use in CI/CD pipeline:')}

\`\`\`yaml
# .github/workflows/menshen.yml
- name: ${lb('门神检查', 'Menshen Check')}
  run: node menshen.js ci --project-path . --threshold 60
\`\`\`
`
  };
}

// ─────────────────────────────
// assess 命令：运行评估
// ─────────────────────────────

async function assessProject(params) {
  const result = await assess(params['project-path'], params.lang, params.output);
  return result;
}

// ─────────────────────────────
// ci 命令：CI/CD 检查
// ─────────────────────────────

async function ciCheck(params) {
  try {
    const result = await assess(params['project-path'], params.lang, 'json');
    const passed = result.score.overall >= params.threshold;
    if (passed) {
      console.log(`✅ ${params.lang === 'zh' ? 'CI/CD 检查通过' : 'CI/CD check passed'} (${result.score.overall}/${params.threshold})`);
      process.exit(0);
    } else {
      console.error(`❌ ${params.lang === 'zh' ? 'CI/CD 检查未通过' : 'CI/CD check failed'} (${result.score.overall}/${params.threshold})`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ ${params.lang === 'zh' ? 'CI/CD 检查失败' : 'CI/CD check failed'}：${error.message}`);
    process.exit(1);
  }
}

// ─────────────────────────────
// 使用说明
// ─────────────────────────────

function printUsage(lang) {
  const lb = (zh, en) => lang === 'zh' ? zh : en;
  console.log(`\n${lb('使用方法 / Usage', 'Usage / Usage')}：\n`);
  console.log(`  ${lb('初始化 / Init', 'Init')}：`);
  console.log(`    node menshen.js init --project-path <path> [--lang zh|en]\n`);
  console.log(`  ${lb('评估 / Assess', 'Assess')}：`);
  console.log(`    node menshen.js assess --project-path <path> [--lang zh|en] [--output console|json|html|markdown]\n`);
  console.log(`  ${lb('CI 检查 / CI Check', 'CI Check')}：`);
  console.log(`    node menshen.js ci --project-path <path> [--threshold 60]\n`);
  console.log(`\n${lb('示例 / Examples', 'Examples / Examples')}：`);
  console.log(`  node menshen.js init --project-path ./my-project`);
  console.log(`  node menshen.js assess --project-path ./my-project --lang zh`);
  console.log(`  node menshen.js ci --project-path ./my-project --threshold 60\n`);
  console.log(`${lb('来源 / Origin', 'Origin / Origin')}：`);
  console.log(`  ${lb('本工具基于 GPQS V1.0 实现。', 'This tool is based on GPQS V1.0.')}`);
  console.log(`  ${lb('GPQS 基于 AVJ 二创。', 'GPQS is forked from AVJ.')}\n`);
}

// ─────────────────────────────
// 主函数
// ─────────────────────────────

async function main() {
  const { command, params } = parseArgs(process.argv);
  const lb = (zh, en) => params.lang === 'zh' ? zh : en;

  console.log(`🛡️  ${lb('门神 / Menshen', 'Menshen / Menshen')}`);
  console.log(`   ${lb('项目上线前的质量门禁检查（基于 GPQS V1.0）', 'Quality gate check before launch (GPQS V1.0)')}\n`);

  try {
    if (command === 'init') {
      initProject(params);
    } else if (command === 'assess') {
      await assessProject(params);
    } else if (command === 'ci') {
      await ciCheck(params);
    } else {
      printUsage(params.lang);
    }
  } catch (error) {
    console.error(`\n❌ ${lb('错误', 'Error')}: ${error.message}\n`);
    process.exit(1);
  }
}

main();
