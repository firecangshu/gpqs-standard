#!/usr/bin/env node

/**
 * 门神评估逻辑 / Menshen Assessment Logic
 *
 * 功能：
 * 1. 读取 7 个 YAML 文件（真正解析）
 * 2. 根据 rubrics/core_v1.0.yaml 规则计算分数
 * 3. 生成评分报告（JSON + HTML + Markdown）
 *
 * 使用方法：
 *   node assess.js --project-path ./my-project --lang zh --output console
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─────────────────────────────────────
// 工具函数
// ─────────────────────────────────────

function label(zh, en, lang) {
  return lang === 'zh' ? zh : en;
}

function readYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content) || {};
}

// ─────────────────────────────────────
// 维度 1：领域知识完整性（20 分）
// ─────────────────────────────────────

function scoreDimension1(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const dk = yamlData['domain_knowledge.yaml'];
  let score = 0;
  const issues = [];
  const suggestions = [];

  if (!dk || !Array.isArray(dk.knowledge_items) || dk.knowledge_items.length === 0) {
    return {
      score: 0, status: 'error',
      issues: [{ priority: 'P0', description: lb('缺少 domain_knowledge.yaml 或 knowledge_items 为空', 'Missing domain_knowledge.yaml or empty knowledge_items') }],
      suggestions: [lb('创建 domain_knowledge.yaml 并填写至少 5 条领域知识', 'Create domain_knowledge.yaml with at least 5 knowledge items')]
    };
  }

  const items = dk.knowledge_items;
  const count = items.length;

  // 1.1 知识条目数量（10 分）
  let s1 = 0;
  if (count >= 10) s1 = 10;
  else if (count >= 5) s1 = 7 + Math.min(count - 5, 2);
  else if (count >= 2) s1 = 4 + (count - 2);
  else s1 = count * 3;

  // 1.2 知识质量（10 分）
  let hasSource = 0, hasPracticality = 0, hasAction = 0;
  for (const item of items) {
    if (item.source && String(item.source).trim()) hasSource++;
    if (item.practicality && String(item.practicality).trim()) hasPracticality++;
    if (item.action && String(item.action).trim()) hasAction++;
  }
  const totalFields = count * 3;
  const qualityRatio = totalFields > 0
    ? (hasSource + hasPracticality + hasAction) / totalFields
    : 0;

  let s2 = 0;
  if (qualityRatio >= 0.9) s2 = 10;
  else if (qualityRatio >= 0.7) s2 = 7 + Math.round((qualityRatio - 0.7) / 0.2 * 2);
  else if (qualityRatio >= 0.4) s2 = 4 + Math.round((qualityRatio - 0.4) / 0.3 * 2);
  else s2 = Math.round(qualityRatio / 0.4 * 3);

  score = s1 + s2;

  // 惩罚：无来源
  if (hasSource < count * 0.5) {
    issues.push({ priority: 'P1', description: lb('部分领域知识缺少来源标注', 'Some domain knowledge items lack source attribution') });
  }

  const status = score >= 18 ? 'good' : score >= 12 ? 'warning' : 'error';
  if (count < 5) {
    suggestions.push(lb('增加领域知识条目（当前 ' + count + ' 条，建议 ≥ 10 条）', 'Add more domain knowledge items (current: ' + count + ', recommended: ≥ 10)'));
  }

  return { score: Math.min(score, 20), status, issues, suggestions };
}

// ─────────────────────────────────────
// 维度 2：功能完整性与可靠性（25 分）
// ─────────────────────────────────────

function scoreDimension2(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const fc = yamlData['functionality_checklist.yaml'];
  let score = 0;
  const issues = [];
  const suggestions = [];

  if (!fc || !Array.isArray(fc.modules) || fc.modules.length === 0) {
    return {
      score: 0, status: 'error',
      issues: [{ priority: 'P0', description: lb('缺少 functionality_checklist.yaml 或 modules 为空', 'Missing functionality_checklist.yaml or empty modules') }],
      suggestions: [lb('创建 functionality_checklist.yaml 并填写功能模块清单', 'Create functionality_checklist.yaml with module checklist')]
    };
  }

  const modules = fc.modules;
  const total = modules.length;
  const complete = modules.filter(m => m.status === 'complete').length;
  const partial = modules.filter(m => m.status === 'partial').length;
  const completenessRate = (complete + partial * 0.5) / total;

  // 2.1 功能完整性（15 分）
  let s1 = 0;
  if (completenessRate >= 0.9) s1 = 15;
  else if (completenessRate >= 0.7) s1 = 11 + Math.round((completenessRate - 0.7) / 0.2 * 3);
  else if (completenessRate >= 0.5) s1 = 6 + Math.round((completenessRate - 0.5) / 0.2 * 4);
  else s1 = Math.round(completenessRate / 0.5 * 5);

  // 2.2 可靠性（10 分）
  let s2 = 0;
  const reliability = fc.reliability || 0;
  if (reliability >= 99) s2 = 10;
  else if (reliability >= 95) s2 = 7 + Math.round((reliability - 95) / 4 * 2);
  else if (reliability >= 90) s2 = 4 + Math.round((reliability - 90) / 5 * 2);
  else s2 = Math.round(reliability / 90 * 3);

  score = s1 + s2;
  const status = score >= 23 ? 'good' : score >= 15 ? 'warning' : 'error';

  if (completenessRate < 0.7) {
    suggestions.push(lb('完善未完成的模块（完成率 ' + Math.round(completenessRate * 100) + '%）', 'Complete unfinished modules (completeness: ' + Math.round(completenessRate * 100) + '%)'));
  }

  return { score: Math.min(score, 25), status, issues, suggestions };
}

// ─────────────────────────────────────
// 维度 3：测试覆盖率与验证强度（20 分）
// ─────────────────────────────────────

function scoreDimension3(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const tc = yamlData['test_coverage.yaml'];
  let score = 0;
  const issues = [];
  const suggestions = [];

  if (!tc) {
    return {
      score: 0, status: 'error',
      issues: [{ priority: 'P0', description: lb('缺少 test_coverage.yaml', 'Missing test_coverage.yaml') }],
      suggestions: [lb('创建 test_coverage.yaml 并填写验证强度等级', 'Create test_coverage.yaml and set validation_level')]
    };
  }

  const vLevel = (tc.validation_level || 'V0').toUpperCase();
  const vMap = { V5: 20, V4: 16, V3: 12, V2: 8, V1: 4, V0: 0 };
  score = vMap[vLevel] || 0;

  // 覆盖率加分
  if (tc.coverage_rate !== undefined) {
    const cov = tc.coverage_rate;
    if (cov >= 80 && score >= 12) score = Math.min(score + 2, 20);
    else if (cov >= 50 && score >= 8) score = Math.min(score + 1, 20);
  }

  const status = score >= 16 ? 'good' : score >= 8 ? 'warning' : 'error';

  if (vLevel === 'V0' || vLevel === 'V1') {
    issues.push({ priority: 'P0', description: lb('验证强度不足（' + vLevel + '）', 'Insufficient validation level (' + vLevel + ')') });
    suggestions.push(lb('增加测试覆盖率，目标：V3 以上（覆盖率 > 80%）', 'Increase test coverage, target: V3+ (coverage > 80%)'));
  }

  return { score: Math.min(score, 20), status, issues, suggestions };
}

// ─────────────────────────────────────
// 维度 4：可维护性与迭代能力（15 分）
// ─────────────────────────────────────

function scoreDimension4(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const mt = yamlData['maintainability.yaml'];
  let score = 0;
  const issues = [];
  const suggestions = [];

  if (!mt) {
    return {
      score: 5, status: 'warning',
      issues: [{ priority: 'P1', description: lb('缺少 maintainability.yaml', 'Missing maintainability.yaml') }],
      suggestions: [lb('创建 maintainability.yaml 并填写代码质量和文档信息', 'Create maintainability.yaml with code quality and documentation info')]
    };
  }

  // 4.1 代码质量（5 分）
  let s1 = 0;
  const complexity = mt.code_complexity || 999;
  if (complexity < 5) s1 = 5;
  else if (complexity <= 10) s1 = 3 + Math.max(0, Math.round((10 - complexity) / 5 * 1));
  else if (complexity <= 20) s1 = 1;
  else s1 = 0;

  // 4.2 文档完整性（5 分）
  let s2 = 0;
  const doc = (mt.documentation_completeness || '').toLowerCase();
  if (doc.includes('readme') && doc.includes('api') && doc.includes('architect')) s2 = 5;
  else if (doc.includes('readme') && doc.includes('api')) s2 = 4;
  else if (doc.includes('readme')) s2 = 2;
  else s2 = 0;

  // 4.3 技术债务管理（5 分）
  let s3 = 0;
  const debt = (mt.technical_debt || 'severe').toLowerCase();
  const debtMap = { none: 5, low: 4, manageable: 3, moderate: 2, severe: 0 };
  s3 = debtMap[debt] || 0;

  score = s1 + s2 + s3;
  const status = score >= 13 ? 'good' : score >= 8 ? 'warning' : 'error';

  if (complexity > 10) {
    suggestions.push(lb('降低代码复杂度（当前 Cyclomatic Complexity: ' + complexity + '）', 'Reduce code complexity (current: ' + complexity + ')'));
  }
  if (s2 < 3) {
    suggestions.push(lb('完善项目文档（README + API 文档 + 架构文档）', 'Improve project documentation (README + API docs + architecture)'));
  }

  return { score: Math.min(score, 15), status, issues, suggestions };
}

// ─────────────────────────────────────
// 维度 5：用户适配与个性化（5 分，可选）
// ─────────────────────────────────────

function scoreDimension5(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  // 可选维度：如果项目没有 user_adaptation 字段，默认给满分
  const ua = yamlData['user_adaptation.yaml'];
  let score = 5;
  let status = 'good';

  if (ua) {
    if (ua.auto_personalization === true) score = 5;
    else if (ua.manual_personalization === true) score = 3;
    else if (ua.basic_personalization === true) score = 2;
    else score = 0;
    status = score >= 4 ? 'good' : score >= 2 ? 'warning' : 'error';
  }

  return { score, status, issues: [], suggestions: [] };
}

// ─────────────────────────────────────
// 维度 6：业务价值与专家经验沉淀（5 分，可选）
// ─────────────────────────────────────

function scoreDimension6(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const dk = yamlData['domain_knowledge.yaml'];
  let score = 5;
  let status = 'good';

  if (dk && dk.expert_experience) {
    const exp = dk.expert_experience;
    const completeness = exp.completeness || 0;
    if (completeness >= 0.8) score = 5;
    else if (completeness >= 0.5) score = 3 + Math.round((completeness - 0.5) / 0.3 * 1);
    else if (completeness >= 0.2) score = 1 + Math.round(completeness / 0.2 * 1);
    else score = 0;
    status = score >= 4 ? 'good' : score >= 2 ? 'warning' : 'error';
  }

  return { score, status, issues: [], suggestions: [] };
}

// ─────────────────────────────────────
// 维度 7：安全性与合规性（10 分）
// ─────────────────────────────────────

function scoreDimension7(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const sc = yamlData['security_checklist.yaml'];
  let score = 0;
  const issues = [];
  const suggestions = [];

  if (!sc || !Array.isArray(sc.items) || sc.items.length === 0) {
    issues.push({ priority: 'P0', description: lb('缺少 security_checklist.yaml（维度 7 直接 0 分）', 'Missing security_checklist.yaml (Dimension 7 = 0)') });
    return { score: 0, status: 'error', issues, suggestions, penalty: 10 };
  }

  const total = sc.items.length;
  const passed = sc.items.filter(i => i.status === 'passed').length;
  const completeness = total > 0 ? passed / total : 0;

  // 7.1 安全清单完成度（10 分）
  if (completeness >= 1.0 && total >= 5) score = 10;
  else if (completeness >= 0.8) score = 7 + Math.round((completeness - 0.8) / 0.2 * 2);
  else if (completeness >= 0.5) score = 4 + Math.round((completeness - 0.5) / 0.3 * 2);
  else score = Math.round(completeness / 0.5 * 3);

  const status = score >= 8 ? 'good' : score >= 4 ? 'warning' : 'error';

  // 关键安全项检查
  const criticalItems = sc.items.filter(i => i.critical === true);
  const criticalPassed = criticalItems.filter(i => i.status === 'passed').length;
  let penalty = 0;
  if (criticalItems.length > 0 && criticalPassed < criticalItems.length) {
    penalty = 5;
    issues.push({
      priority: 'P0',
      description: lb('关键安全项未全部通过（' + criticalPassed + '/' + criticalItems.length + '）', 'Critical security items not all passed (' + criticalPassed + '/' + criticalItems.length + ')')
    });
  }

  if (completeness < 0.8) {
    suggestions.push(lb('完善安全清单（当前通过率 ' + Math.round(completeness * 100) + '%）', 'Complete security checklist (current pass rate: ' + Math.round(completeness * 100) + '%)'));
  }

  return { score: Math.min(score, 10), status, issues, suggestions, penalty };
}

// ─────────────────────────────────────
// 主评分函数
// ─────────────────────────────────────

function calculateScore(yamlData, lang) {
  const lb = (z, e) => label(z, e, lang);
  const dims = [];
  const allIssues = [];
  const allSuggestions = [];
  let totalPenalty = 0;

  const r1 = scoreDimension1(yamlData, lang);
  dims.push({ id: 1, name: lb('领域知识完整性', 'Domain Knowledge Completeness'), weight: 20, score: r1.score, status: r1.status });
  allIssues.push(...r1.issues);
  allSuggestions.push(...r1.suggestions);

  const r2 = scoreDimension2(yamlData, lang);
  dims.push({ id: 2, name: lb('功能完整性与可靠性', 'Functionality Completeness & Reliability'), weight: 25, score: r2.score, status: r2.status });
  allIssues.push(...r2.issues);
  allSuggestions.push(...r2.suggestions);

  const r3 = scoreDimension3(yamlData, lang);
  dims.push({ id: 3, name: lb('测试覆盖率与验证强度', 'Test Coverage & Validation Strength'), weight: 20, score: r3.score, status: r3.status });
  allIssues.push(...r3.issues);
  allSuggestions.push(...r3.suggestions);

  const r4 = scoreDimension4(yamlData, lang);
  dims.push({ id: 4, name: lb('可维护性与迭代能力', 'Maintainability & Iteration Capability'), weight: 15, score: r4.score, status: r4.status });
  allIssues.push(...r4.issues);
  allSuggestions.push(...r4.suggestions);

  const r5 = scoreDimension5(yamlData, lang);
  dims.push({ id: 5, name: lb('用户适配与个性化', 'User Adaptation & Personalization'), weight: 5, score: r5.score, status: r5.status });

  const r6 = scoreDimension6(yamlData, lang);
  dims.push({ id: 6, name: lb('业务价值与专家经验沉淀', 'Business Value & Expert Experience'), weight: 5, score: r6.score, status: r6.status });

  const r7 = scoreDimension7(yamlData, lang);
  dims.push({ id: 7, name: lb('安全性与合规性', 'Security & Compliance'), weight: 10, score: r7.score, status: r7.status });
  allIssues.push(...r7.issues);
  allSuggestions.push(...r7.suggestions);
  totalPenalty += (r7.penalty || 0);

  const rawTotal = dims.reduce((s, d) => s + d.score, 0);
  const overall = Math.max(0, rawTotal - totalPenalty);

  const projectName = yamlData['project_info.yaml']
    ? (yamlData['project_info.yaml'].project_name || 'Unknown')
    : 'Unknown';

  return {
    project_name: projectName,
    version: yamlData['project_info.yaml'] ? (yamlData['project_info.yaml'].version || 'v1.0.0') : 'v1.0.0',
    assessed_at: new Date().toISOString(),
    overall: overall,
    passing_threshold: 60,
    passed: overall >= 60,
    dimensions: dims,
    penalties: totalPenalty > 0 ? [{ reason: lb('安全清单缺失或关键项未通过', 'Missing security checklist or critical items failed'), amount: totalPenalty }] : [],
    major_issues: allIssues,
    improvement_suggestions: allSuggestions
  };
}

// ─────────────────────────────────────
// 报告生成
// ─────────────────────────────────────

function generateMarkdownReport(score, lang) {
  const lb = (z, e) => label(z, e, lang);
  let md = '# ' + lb('门神评估报告', 'Menshen Assessment Report') + '\n\n';

  md += '## ' + lb('项目信息', 'Project Info') + '\n\n';
  md += '- ' + lb('项目名称', 'Project Name') + ': ' + score.project_name + '\n';
  md += '- ' + lb('版本', 'Version') + ': ' + score.version + '\n';
  md += '- ' + lb('评估时间', 'Assessment Time') + ': ' + score.assessed_at + '\n\n';

  md += '## ' + lb('总分', 'Overall Score') + '\n\n';
  md += '**' + score.overall + ' / 100** ' + (score.passed ? '✅' : '❌') + '（' + lb('及格线', 'Threshold') + ': ' + score.passing_threshold + '）\n\n';

  if (score.penalties && score.penalties.length > 0) {
    md += '## ' + lb('惩罚', 'Penalties') + '\n\n';
    for (const p of score.penalties) {
      md += '- ⚠️ **-' + p.amount + ' ' + lb('分', 'pts') + '**：' + p.reason + '\n';
    }
    md += '\n';
  }

  md += '## ' + lb('维度评分', 'Dimension Scores') + '\n\n';
  md += '| ' + lb('维度', 'Dim') + ' | ' + lb('权重', 'Wt') + ' | ' + lb('分数', 'Score') + ' | ' + lb('状态', 'Status') + ' |\n';
  md += '|--------|------|--------|--------|\n';
  for (const d of score.dimensions) {
    const icon = d.status === 'good' ? '✅' : d.status === 'warning' ? '⚠️' : '❌';
    md += '| ' + d.id + '. ' + d.name + ' | ' + d.weight + '% | ' + d.score + '/' + d.weight + ' | ' + icon + ' |\n';
  }
  md += '\n';

  if (score.major_issues && score.major_issues.length > 0) {
    md += '## ' + lb('主要问题', 'Major Issues') + '\n\n';
    for (const issue of score.major_issues) {
      md += '- **[' + issue.priority + ']** ' + issue.description + '\n';
    }
    md += '\n';
  }

  if (score.improvement_suggestions && score.improvement_suggestions.length > 0) {
    md += '## ' + lb('改进建议', 'Improvement Suggestions') + '\n\n';
    for (let i = 0; i < score.improvement_suggestions.length; i++) {
      md += (i + 1) + '. ' + score.improvement_suggestions[i] + '\n';
    }
    md += '\n';
  }

  md += '---\n\n';
  md += lb('详细报告', 'Detailed reports') + ':\n';
  md += '- HTML: `.gpqs/score-report.html`\n';
  md += '- JSON: `.gpqs/score.json`\n';

  return md;
}

function generateHtmlReport(score, lang) {
  const lb = (z, e) => label(z, e, lang);
  const passedClass = score.passed ? 'pass' : 'fail';
  const dimRows = score.dimensions.map(d => {
    const icon = d.status === 'good' ? '✅' : d.status === 'warning' ? '⚠️' : '❌';
    return '<tr><td>' + d.id + '. ' + d.name + '</td><td>' + d.weight + '%</td><td>' + d.score + '/' + d.weight + '</td><td>' + icon + '</td></tr>';
  }).join('\n    ');

  const issuesHtml = (score.major_issues || []).map(i =>
    '    <li><strong>[' + i.priority + ']</strong> ' + i.description + '</li>'
  ).join('\n');

  const suggestionsHtml = (score.improvement_suggestions || []).map((s, i) =>
    '    <li>' + s + '</li>'
  ).join('\n');

  return '<!DOCTYPE html>\n<html lang="' + (lang === 'zh' ? 'zh-CN' : 'en') + '">\n<head>\n  <meta charset="UTF-8">\n  <title>' + lb('门神评估报告', 'Menshen Assessment Report') + '</title>\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; background: #f5f5f5; }\n    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n    h1 { color: #333; border-bottom: 2px solid #1a6dff; padding-bottom: 10px; }\n    .score { font-size: 48px; font-weight: bold; text-align: center; margin: 30px 0; }\n    .pass { color: #00b365; }\n    .fail { color: #e53935; }\n    table { border-collapse: collapse; width: 100%; margin: 20px 0; }\n    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }\n    th { background-color: #f2f2f2; font-weight: bold; }\n    .penalty { background: #fff3cd; padding: 12px; border-radius: 4px; margin: 10px 0; }\n    ul li, ol li { margin: 8px 0; }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <h1>🛡️ ' + lb('门神评估报告', 'Menshen Assessment Report') + '</h1>\n    <h2>' + lb('项目信息', 'Project Info') + '</h2>\n    <p><strong>' + lb('项目名称', 'Project') + '</strong>: ' + score.project_name + '</p>\n    <p><strong>' + lb('版本', 'Version') + '</strong>: ' + score.version + '</p>\n    <p><strong>' + lb('评估时间', 'Assessed') + '</strong>: ' + score.assessed_at + '</p>\n    <h2>' + lb('总分', 'Overall Score') + '</h2>\n    <div class="score ' + passedClass + '">' + score.overall + ' / 100</div>\n    <p style="text-align:center">' + lb('及格线', 'Threshold') + ': ' + score.passing_threshold + ' → ' + (score.passed ? '✅ ' + lb('通过', 'PASS') : '❌ ' + lb('未通过', 'FAIL')) + '</p>\n    ' + (score.penalties && score.penalties.length > 0 ? '<div class="penalty">⚠️ <strong>' + lb('惩罚', 'Penalties') + '</strong>: ' + score.penalties.map(p => '-' + p.amount + 'pts (' + p.reason + ')').join('; ') + '</div>' : '') + '\n    <h2>' + lb('维度评分', 'Dimension Scores') + '</h2>\n    <table>\n      <tr><th>' + lb('维度', 'Dim') + '</th><th>' + lb('权重', 'Weight') + '</th><th>' + lb('分数', 'Score') + '</th><th>' + lb('状态', 'Status') + '</th></tr>\n      ' + dimRows + '\n    </table>\n    ' + (issuesHtml ? '<h2>' + lb('主要问题', 'Major Issues') + '</h2><ul>' + issuesHtml + '</ul>' : '') + '\n    ' + (suggestionsHtml ? '<h2>' + lb('改进建议', 'Improvement Suggestions') + '</h2><ol>' + suggestionsHtml + '</ol>' : '') + '\n    <hr>\n    <p><em>' + lb('由门神（Menshen）生成，基于 GPQS V1.0 标准', 'Generated by Menshen (GPQS V1.0)') + '</em></p>\n  </div>\n</body>\n</html>';
}

function printConsole(score, lang) {
  const lb = (z, e) => label(z, e, lang);
  console.log('\n📊 ' + lb('门神评估报告', 'Menshen Assessment Report'));
  console.log('='.repeat(50));
  console.log(lb('项目', 'Project') + ': ' + score.project_name);
  console.log(lb('总分', 'Overall') + ': ' + score.overall + ' / 100 ' + (score.passed ? '✅' : '❌'));
  console.log('='.repeat(50));

  console.log('\n' + lb('维度评分', 'Dimension Scores') + ':');
  for (const d of score.dimensions) {
    const icon = d.status === 'good' ? '✅' : d.status === 'warning' ? '⚠️' : '❌';
    const bar = '█'.repeat(Math.round(d.score / d.weight * 10)) + '░'.repeat(10 - Math.round(d.score / d.weight * 10));
    console.log('  ' + d.id + '. ' + d.name.padEnd(22, ' ') + ' ' + String(d.score).padStart(2, ' ') + '/' + d.weight + ' ' + icon + '  ' + bar);
  }

  if (score.penalties && score.penalties.length > 0) {
    console.log('\n⚠️ ' + lb('惩罚', 'Penalties') + ':');
    for (const p of score.penalties) {
      console.log('  -' + p.amount + 'pts: ' + p.reason);
    }
  }

  if (score.major_issues && score.major_issues.length > 0) {
    console.log('\n' + lb('主要问题', 'Major Issues') + ':');
    for (const issue of score.major_issues) {
      console.log('  [' + issue.priority + '] ' + issue.description);
    }
  }

  if (score.improvement_suggestions && score.improvement_suggestions.length > 0) {
    console.log('\n' + lb('改进建议', 'Improvement Suggestions') + ':');
    for (let i = 0; i < score.improvement_suggestions.length; i++) {
      console.log('  ' + (i + 1) + '. ' + score.improvement_suggestions[i]);
    }
  }
}

// ─────────────────────────────────────
// 主函数
// ─────────────────────────────────────

async function assess(projectPath, lang, output) {
  const lb = (z, e) => label(z, e, lang);
  console.log('🛡️ ' + lb('门神评估', 'Menshen Assessment'));
  console.log('> ' + lb('项目路径', 'Project path') + ': ' + projectPath + '\n');

  try {
    const gpqsDir = path.join(projectPath, '.gpqs');
    if (!fs.existsSync(gpqsDir)) {
      throw new Error(
        lb('.gpqs/ 目录不存在，请先运行「门神初始化」', '.gpqs/ directory not found. Run "menshen init" first.')
      );
    }

    console.log('📄 ' + lb('读取 YAML 文件', 'Reading YAML files') + '...\n');

    const yamlFiles = [
      'project_info.yaml',
      'domain_knowledge.yaml',
      'functionality_checklist.yaml',
      'test_coverage.yaml',
      'maintainability.yaml',
      'security_checklist.yaml',
      'deployment_readiness.yaml'
    ];

    const yamlData = {};
    for (const file of yamlFiles) {
      const filePath = path.join(gpqsDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn('⚠️ ' + lb('缺少文件', 'Missing file') + ': ' + file + ' ' + lb('（跳过）', '(skipped)'));
        yamlData[file] = null;
        continue;
      }
      yamlData[file] = readYaml(filePath);
      console.log('  ✅ ' + file);
    }

    console.log('\n🧮 ' + lb('运行评分引擎', 'Running scoring engine') + '...\n');

    const score = calculateScore(yamlData, lang);

    // 生成报告文件
    const reportPaths = [];
    const jsonPath = path.join(gpqsDir, 'score.json');
    fs.writeFileSync(jsonPath, JSON.stringify(score, null, 2), 'utf8');
    reportPaths.push(jsonPath);

    const mdPath = path.join(gpqsDir, 'score-report.md');
    fs.writeFileSync(mdPath, generateMarkdownReport(score, lang), 'utf8');
    reportPaths.push(mdPath);

    const htmlPath = path.join(gpqsDir, 'score-report.html');
    fs.writeFileSync(htmlPath, generateHtmlReport(score, lang), 'utf8');
    reportPaths.push(htmlPath);

    // 输出
    if (output === 'console' || output === 'markdown') {
      printConsole(score, lang);
    }

    console.log('\n' + lb('详细报告已保存到', 'Detailed report saved to') + ':');
    reportPaths.forEach(p => console.log('  - ' + p));

    const threshold = score.passing_threshold || 60;
    if (score.passed) {
      console.log('\n✅ ' + lb('门神检查通过！总分', 'Menshen check PASSED! Score') + ': ' + score.overall + ' / 100（' + lb('及格线', 'threshold') + ': ' + threshold + '）\n');
      return { passed: true, score };
    } else {
      console.log('\n❌ ' + lb('门神检查未通过！总分', 'Menshen check FAILED! Score') + ': ' + score.overall + ' / 100（' + lb('及格线', 'threshold') + ': ' + threshold + '）\n');
      return { passed: false, score };
    }
  } catch (error) {
    console.error('\n❌ ' + lb('门神评估失败', 'Menshen assessment failed!'));
    console.error(lb('错误原因', 'Error') + ': ' + error.message + '\n');
    throw error;
  }
}

// ─────────────────────────────────────
// CLI 入口
// ─────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      params[key] = value;
      if (value !== true) i++;
    }
  }

  const projectPath = params['project-path'] || process.cwd();
  const lang = params.lang || 'zh';
  const output = params.output || 'console';

  assess(projectPath, lang, output)
    .then(result => { process.exit(result.passed ? 0 : 1); })
    .catch(() => { process.exit(1); });
}

module.exports = { assess };
