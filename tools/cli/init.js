#!/usr/bin/env node

/**
 * 门神初始化逻辑 / Menshen Initialization Logic
 * 
 * 功能：
 * 1. 获取项目路径
 * 2. 扫描项目结构
 * 3. 生成 7 个 YAML 文件（初版）
 * 
 * 使用方法：
 *   node init.js --project-path ./my-project
 */

const fs = require('fs');
const path = require('path');

// 主函数
async function init(projectPath, lang = 'zh') {
  console.log('🛠️ 门神初始化 / Menshen Initialization');
  console.log(`> 项目路径 / Project path: ${projectPath}\n`);
  
  try {
    // 1. 检查项目路径
    projectPath = path.resolve(projectPath);
    console.log(`📂 检查项目路径...`);
    
    if (!fs.existsSync(projectPath)) {
      throw new Error(`项目路径不存在 / Project path does not exist: ${projectPath}`);
    }
    
    console.log(`✅ 项目路径正确 / Project path exists\n`);
    
    // 2. 创建 gpqs/ 目录
    const gpqsDir = path.join(projectPath, 'gpqs');
    if (!fs.existsSync(gpqsDir)) {
      fs.mkdirSync(gpqsDir, { recursive: true });
      console.log(`✅ 创建目录 / Created directory: gpqs/\n`);
    } else {
      console.log(`⚠️ 目录已存在 / Directory already exists: gpqs/\n`);
    }
    
    // 3. 扫描项目结构
    console.log(`🔍 扫描项目结构 / Scanning project structure...`);
    const projectInfo = scanProject(projectPath);
    
    console.log(`✅ 项目扫描完成 / Project scan completed\n`);
    console.log(`   项目类型 / Project type: ${projectInfo.projectType}`);
    console.log(`   源代码文件 / Source files: ${projectInfo.sourceFiles.length} 个 / files`);
    console.log(`   测试文件 / Test files: ${projectInfo.testFiles.length} 个 / files`);
    console.log(`   文档文件 / Doc files: ${projectInfo.docFiles.length} 个 / files`);
    console.log(`   配置文件 / Config files: ${projectInfo.configFiles.length} 个 / files\n`);
    
    // 4. 生成 7 个 YAML 文件
    console.log(`📄 生成 YAML 文件 / Generating YAML files...\n`);
    
    const yamlFiles = [
      'project_info.yaml',
      'domain_knowledge.yaml',
      'functionality_checklist.yaml',
      'test_coverage.yaml',
      'maintainability.yaml',
      'security_checklist.yaml',
      'deployment_readiness.yaml'
    ];
    
    for (const file of yamlFiles) {
      const filePath = path.join(gpqsDir, file);
      
      if (fs.existsSync(filePath)) {
        console.log(`⚠️ 已存在 / Already exists: ${file}（跳过 / skipped）`);
        continue;
      }
      
      // 生成初版 YAML
      const content = generateInitialYaml(file, projectInfo, lang);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已生成 / Generated: ${file}`);
    }
    
    console.log(`\n✅ 门神初始化完成 / Menshen initialization completed!\n`);
    console.log(`请检查并修改这些文件，然后运行「门神评估」/`);
    console.log(`Please check and modify these files, then run "门神评估" / "Menshen assess".\n`);
    
    console.log(`已生成以下文件 / Generated files:`);
    yamlFiles.forEach(file => {
      console.log(`  - gpqs/${file}`);
    });
    
    return true;
  } catch (error) {
    console.error(`\n❌ 门神初始化失败 / Menshen initialization failed!`);
    console.error(`错误原因 / Error: ${error.message}\n`);
    throw error;
  }
}

// 扫描项目结构
function scanProject(projectPath) {
  const projectInfo = {
    projectType: 'unknown',
    sourceFiles: [],
    testFiles: [],
    docFiles: [],
    configFiles: []
  };
  
  // 识别项目类型
  const packageJsonPath = path.join(projectPath, 'package.json');
  const projectConfigPath = path.join(projectPath, 'project.config.json');
  const appJsonPath = path.join(projectPath, 'app.json');
  
  if (fs.existsSync(projectConfigPath) && fs.existsSync(appJsonPath)) {
    projectInfo.projectType = 'wechat_miniprogram';
  } else if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.dependencies && packageJson.dependencies.react) {
      projectInfo.projectType = 'web_react';
    } else if (packageJson.dependencies && packageJson.dependencies.vue) {
      projectInfo.projectType = 'web_vue';
    } else {
      projectInfo.projectType = 'nodejs';
    }
  }
  
  // 扫描文件
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // 跳过 node_modules、.git 等目录
      if (stat.isDirectory()) {
        if (file === 'node_modules' || file === '.git' || file === '.github') {
          continue;
        }
        
        walkDir(filePath);
        continue;
      }
      
      // 分类文件
      const ext = path.extname(file);
      const relativePath = path.relative(projectPath, filePath);
      
      // 源代码文件
      if (['.js', '.jsx', '.ts', '.tsx', '.wxml', '.vue', '.py', '.java'].includes(ext)) {
        projectInfo.sourceFiles.push(relativePath);
      }
      
      // 测试文件
      if (file.includes('.test.') || file.includes('.spec.') || file.includes('test_') || file.includes('_test.')) {
        projectInfo.testFiles.push(relativePath);
      }
      
      // 文档文件
      if (['.md', '.txt', '.docx', '.pdf'].includes(ext)) {
        projectInfo.docFiles.push(relativePath);
      }
      
      // 配置文件
      if (['.json', '.yaml', '.yml', '.config.'].some(s => file.includes(s))) {
        projectInfo.configFiles.push(relativePath);
      }
    }
  }
  
  try {
    walkDir(projectPath);
  } catch (error) {
    console.log(`⚠️ 扫描项目时出错 / Error scanning project: ${error.message}`);
  }
  
  return projectInfo;
}

// 生成初版 YAML
function generateInitialYaml(filename, projectInfo, lang) {
  // 根据文件名生成模板
  const templates = {
    'project_info.yaml': generateProjectInfoYaml(projectInfo, lang),
    'domain_knowledge.yaml': generateDomainKnowledgeYaml(lang),
    'functionality_checklist.yaml': generateFunctionalityChecklistYaml(projectInfo, lang),
    'test_coverage.yaml': generateTestCoverageYaml(projectInfo, lang),
    'maintainability.yaml': generateMaintainabilityYaml(projectInfo, lang),
    'security_checklist.yaml': generateSecurityChecklistYaml(lang),
    'deployment_readiness.yaml': generateDeploymentReadinessYaml(lang)
  };
  
  return templates[filename] || `# ${filename}\n# 请根据项目实际情况填写 / Please fill in according to the actual project situation\n`;
}

// 生成 project_info.yaml
function generateProjectInfoYaml(projectInfo, lang) {
  const projectName = path.basename(projectInfo.projectPath || 'my-project');
  
  if (lang === 'zh') {
    return `# 项目基本信息 / Project Basic Info
project_name: "${projectName}"
project_name_en: "${projectName}"
version: "v1.0.0"
project_type: "${projectInfo.projectType}"
domain: "我的领域"
domain_en: "My Domain"
description: |
  项目描述。
  Project description.
maintainers:
  - name: "维护者姓名"
    role: "角色"
    email: "email@example.com"
tech_stack:
  - "技术栈 1"
  - "技术栈 2"
repository:
  type: "git"
  url: ""
  branch: "main"
`;
  } else {
    return `# Project Basic Info
project_name: "${projectName}"
project_name_en: "${projectName}"
version: "v1.0.0"
project_type: "${projectInfo.projectType}"
domain: "My Domain"
domain_en: "My Domain"
description: |
  Project description.
maintainers:
  - name: "Maintainer Name"
    role: "Role"
    email: "email@example.com"
tech_stack:
  - "Tech Stack 1"
  - "Tech Stack 2"
repository:
  type: "git"
  url: ""
  branch: "main"
`;
  }
}

// 生成 domain_knowledge.yaml
function generateDomainKnowledgeYaml(lang) {
  if (lang === 'zh') {
    return `# 领域知识清单 / Domain Knowledge Checklist
knowledge_items:
  # 示例 / Example:
  # - id: "DK001"
  #   statement: "领域规则 1"
  #   source_type: "expert_experience"
  #   rarity: "high"
  #   practicality: "high"
  #   actionability: "high"
  #   reusability: "high"
  #   how_it_changes_agent_behavior: "改变行为的描述"
  #   evidence:
  #     level: "E1"
  #     description: "证据描述"
`;
  } else {
    return `# Domain Knowledge Checklist
knowledge_items:
  # Example:
  # - id: "DK001"
  #   statement: "Domain rule 1"
  #   source_type: "expert_experience"
  #   rarity: "high"
  #   practicality: "high"
  #   actionability: "high"
  #   reusability: "high"
  #   how_it_changes_agent_behavior: "Description of behavior change"
  #   evidence:
  #     level: "E1"
  #     description: "Evidence description"
`;
  }
}

// 生成 functionality_checklist.yaml
function generateFunctionalityChecklistYaml(projectInfo, lang) {
  if (lang === 'zh') {
    return `# 功能完整性清单 / Functionality Checklist
modules:
  # 示例 / Example:
  # - id: "M001"
  #   name: "功能模块 1"
  #   description: "功能描述"
  #   status: "implemented"  # implemented / partial / not_implemented
  #   test_status: "none"  # none / partial / complete
  #   test_coverage: "0%"
`;
  } else {
    return `# Functionality Checklist
modules:
  # Example:
  # - id: "M001"
  #   name: "Functionality Module 1"
  #   description: "Function description"
  #   status: "implemented"  # implemented / partial / not_implemented
  #   test_status: "none"  # none / partial / complete
  #   test_coverage: "0%"
`;
  }
}

// 生成 test_coverage.yaml
function generateTestCoverageYaml(projectInfo, lang) {
  if (lang === 'zh') {
    return `# 测试覆盖率报告 / Test Coverage Report
test_status: "none"  # none / partial / complete
test_tools:
  - name: "无"
    version: "-"
    coverage: "0%"
unit_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
integration_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
e2e_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
validation_level: "V0"  # V0-V5
validation_description: "无验证（代码写完就上线）"
`;
  } else {
    return `# Test Coverage Report
test_status: "none"  # none / partial / complete
test_tools:
  - name: "None"
    version: "-"
    coverage: "0%"
unit_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
integration_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
e2e_tests:
  total: 0
  passed: 0
  failed: 0
  coverage: "0%"
validation_level: "V0"  # V0-V5
validation_description: "No validation (deploy immediately after coding)"
`;
  }
}

// 生成 maintainability.yaml
function generateMaintainabilityYaml(projectInfo, lang) {
  if (lang === 'zh') {
    return `# 可维护性评估 / Maintainability Assessment
code_quality:
  cyclomatic_complexity:
    average: "10"
    max: "20"
    threshold: "10"
    status: "good"
  duplication:
    percentage: "5%"
    status: "good"
  documentation:
    inline_comments: "none"
    api_docs: "none"
    readme: "exists"
    status: "needs_improvement"
technical_debt:
  estimated_hours: "0"
  categories: []
  status: "low"
refactoring_priority: []
`;
  } else {
    return `# Maintainability Assessment
code_quality:
  cyclomatic_complexity:
    average: "10"
    max: "20"
    threshold: "10"
    status: "good"
  duplication:
    percentage: "5%"
    status: "good"
  documentation:
    inline_comments: "none"
    api_docs: "none"
    readme: "exists"
    status: "needs_improvement"
technical_debt:
  estimated_hours: "0"
  categories: []
  status: "low"
refactoring_priority: []
`;
  }
}

// 生成 security_checklist.yaml
function generateSecurityChecklistYaml(lang) {
  if (lang === 'zh') {
    return `# 安全与合规性清单 / Security & Compliance Checklist
data_security:
  - item: "用户隐私数据加密"
    status: "not_implemented"
    priority: "P0"
    description: "用户隐私数据需要加密存储"

access_control:
  - item: "用户身份验证"
    status: "not_implemented"
    priority: "P0"
    description: "需要实现用户登录和身份验证"

compliance:
  - item: "数据合规"
    status: "not_implemented"
    priority: "P0"
    description: "需要符合相关数据保护法规"

risk_assessment:
  overall_risk: "medium"
  risks: []
`;
  } else {
    return `# Security & Compliance Checklist
data_security:
  - item: "User privacy data encryption"
    status: "not_implemented"
    priority: "P0"
    description: "User privacy data needs encrypted storage"

access_control:
  - item: "User authentication"
    status: "not_implemented"
    priority: "P0"
    description: "Need to implement user login and authentication"

compliance:
  - item: "Data compliance"
    status: "not_implemented"
    priority: "P0"
    description: "Need to comply with relevant data protection regulations"

risk_assessment:
  overall_risk: "medium"
  risks: []
`;
  }
}

// 生成 deployment_readiness.yaml
function generateDeploymentReadinessYaml(lang) {
  if (lang === 'zh') {
    return `# 上线准备清单 / Deployment Readiness Checklist
environment_config:
  - item: "生产环境配置"
    status: "not_ready"
    description: "需要配置生产环境的 API 端点、数据库连接等"

monitoring_alerting:
  - item: "错误监控（Sentry 等）"
    status: "not_implemented"
    priority: "P0"
    description: "需要集成错误监控工具，及时发现线上问题"

rollback_plan:
  - item: "版本管理（Git）"
    status: "ready"
    description: "已使用 Git 进行版本管理，可以回滚到任意版本"

deployment_checklist:
  - item: "代码审查"
    status: "not_ready"
    description: "上线前需要进行代码审查（Code Review）"

overall_readiness: "not_ready"  # not_ready / partially_ready / ready
estimated_hours_to_launch: "0"
`;
  } else {
    return `# Deployment Readiness Checklist
environment_config:
  - item: "Production environment configuration"
    status: "not_ready"
    description: "Need to configure production API endpoints, database connections, etc."

monitoring_alerting:
  - item: "Error monitoring (Sentry, etc.)"
    status: "not_implemented"
    priority: "P0"
    description: "Need to integrate error monitoring tools to detect online issues in time"

rollback_plan:
  - item: "Version management (Git)"
    status: "ready"
    description: "Using Git for version management, can roll back to any version"

deployment_checklist:
  - item: "Code review"
    status: "not_ready"
    description: "Need code review before launch"

overall_readiness: "not_ready"  # not_ready / partially_ready / ready
estimated_hours_to_launch: "0"
`;
  }
}

// 命令行直接运行时
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
  
  init(projectPath, lang).catch(error => {
    process.exit(1);
  });
}

module.exports = { init };
