# 门神 CI/CD 集成工作流 / Menshen CI Workflow#

> 集成到 GitHub Actions，每次 PR 自动检查项目质量

---

## 触发词 / Trigger#

### 中文
- "门神集成到 CI"
- "门神 CI"
- "生成 GitHub Actions 配置"

### English
- "Menshen CI"
- "Menshen integrate CI"
- "Generate GitHub Actions config"

---

## 输入参数 / Input Parameters#

| 参数 | 必填 | 说明 |
|------|------|------|
| `project-path` | 是 | 项目根目录路径 |
| `threshold` | 否 | 及格线（默认 60 分） |
| `lang` | 否 | 输出语言（`zh` / `en`，默认 `zh`） |
| `ci-platform` | 否 | CI 平台（`github-actions` / `jenkins`，默认 `github-actions`） |

---

## 执行流程 / Execution Flow#

### 步骤 1：选择 CI 平台#

**询问用户**（如果未提供 `ci-platform`）：
```
请选择 CI/CD 平台：

1. GitHub Actions（推荐）
2. Jenkins
3. GitLab CI
4. 其他（请说明）
```

---

### 步骤 2：生成 CI 配置文件#

#### 平台 1：GitHub Actions#

**生成文件**：`.github/workflows/menshen-check.yml`

```yaml
# .github/workflows/menshen-check.yml
name: 门神质量检查 / Menshen Quality Check

on:
  pull_request:
    branches: [main, dev-*]
  push:
    branches: [main, dev-*]

jobs:
  menshen-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码 / Checkout Code
        uses: actions/checkout@v3
      
      - name: 设置 Node.js / Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: 安装依赖 / Install Dependencies
        run: |
          cd gpqs-standard/tools/cli
          npm install
      
      - name: 运行门神评估 / Run Menshen Assessment
        run: |
          cd gpqs-standard/tools/cli
          node menshen.js assess --project-path ../../.. --lang zh --output json
        continue-on-error: true
      
      - name: 读取评分结果 / Read Score Result
        run: |
          cd gpqs-standard/tools/cli
          SCORE=$(cat ../../gpqs/score.json | jq -r '.overall_score')
          echo "SCORE=$SCORE" >> $GITHUB_ENV
          echo "📊 门神评分：$SCORE / 100"
      
      - name: 检查评分结果 / Check Score
        run: |
          THRESHOLD={stitch_trigger}
          if [ $SCORE -lt $THRESHOLD ]; then
            echo "❌ 门神检查未通过！总分：$SCORE / 100（及格线：$THRESHOLD）"
            echo "详细报告：gpqs/score-report.html"
            exit 1
          else
            echo "✅ 门神检查通过！总分：$SCORE / 100（及格线：$THRESHOLD）"
          fi
      
      - name: 上传评分报告 / Upload Score Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: menshen-score-report
          path: gpqs/score-report.html
```

**输出**：
```
✅ GitHub Actions 配置已生成！

文件位置：.github/workflows/menshen-check.yml

下次创建 PR 时，门神会自动运行评估。

如果总分 < 60，PR 将被阻止合并。
```

---

#### 平台 2：Jenkins#

**生成文件**：`jenkins.groovy`

```groovy
// jenkins.groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'PROJECT_PATH', defaultValue: '.', description: '项目路径')
        int(name: 'THRESHOLD', defaultValue: 60, description: '及格线（总分 100）')
    }
    
    stages {
        stage('检出代码 / Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }
        
        stage('运行门神评估 / Run Menshen Assessment') {
            steps {
                sh '''
                    cd gpqs-standard/tools/cli
                    node menshen.js assess --project-path ${PROJECT_PATH} --lang zh --output json
                '''
            }
        }
        
        stage('检查评分结果 / Check Score') {
            steps {
                script {
                    def scoreJson = readJSON file: 'gpqs/score.json'
                    def score = scoreJson.overall_score
                    def threshold = params.THRESHOLD
                    
                    echo "📊 门神评分：${score} / 100"
                    
                    if (score < threshold) {
                        error "❌ 门神检查未通过！总分：${score} / 100（及格线：${threshold}）"
                    } else {
                        echo "✅ 门神检查通过！总分：${score} / 100（及格线：${threshold}）"
                    }
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'gpqs/score-report.html', fingerprint: true
        }
    }
}
```

**输出**：
```
✅ Jenkins 配置已生成！

文件位置：jenkins.groovy

使用方法：
1. 打开 Jenkins
2. 新建任务 → 选择「Pipeline」
3. 在「Pipeline script」中，粘贴 `jenkins.groovy` 的内容
4. 保存并运行

每次构建时，门神会自动运行评估。

如果总分 < 60，构建将失败。
```

---

### 步骤 3：提示用户提交和推送#

**输出**：
```
✅ 门神 CI/CD 集成完成！

已生成以下文件：
- .github/workflows/menshen-check.yml

下一步：
1. 提交这些文件到仓库：
   git add .github/workflows/menshen-check.yml
   git commit -m "ci: 添加门神质量检查（GPQS V1.0）"
   git push origin main

2. 创建 PR，门神会自动运行评估。

3. 如果总分 < 60，PR 将被阻止合并。

详细文档：https://github.com/firecangshu/gpqs-standard/blob/main/docs/ci-integration.md
```

---

## 输出格式 / Output Format#

### 成功输出#

```
✅ 门神 CI/CD 集成完成！

已生成以下文件：
- .github/workflows/menshen-check.yml

下一步：
1. 提交这些文件到仓库
2. 创建 PR，门神会自动运行评估
3. 如果总分 < 60，PR 将被阻止合并
```

### 错误输出#

```
❌ 门神 CI 集成失败！

错误原因：{error_message}

请检查：
1. 项目路径是否正确？
2. 是否有写入权限？
3. CI 平台是否支持？

修复后重试。
```

---

## 后续步骤 / Next Steps#

1. **提交 CI 配置文件**
   ```bash
   git add .github/workflows/menshen-check.yml
   git commit -m "ci: 添加门神质量检查（GPQS V1.0）"
   git push origin main
   ```

2. **创建 PR 测试**
   - 创建一个新的 PR
   - 门神会自动运行评估
   - 查看「Checks」标签页，看门神的检查结果

3. **查看评分报告**
   - 门神会生成 `gpqs/score-report.html`
   - 在「Artifacts」中下载报告

4. **（可选）调整及格线**
   - 编辑 `.github/workflows/menshen-check.yml`
   - 修改 `THRESHOLD` 的值（默认 60）
   - 提交并推送

---

## 示例 / Example#

### 用户输入#

```
门神集成到 CI
```

### AI 输出#

```
好的，我来帮你集成门神到 CI/CD。

请选择 CI/CD 平台：

1. GitHub Actions（推荐）
2. Jenkins
3. GitLab CI
4. 其他（请说明）
```

### 用户输入#

```
1
```

### AI 输出#

```
✅ GitHub Actions 配置已生成！

文件位置：.github/workflows/menshen-check.yml

下次创建 PR 时，门神会自动运行评估。

如果总分 < 60，PR 将被阻止合并。

是否立即提交这些文件？
- 是：我来帮你提交
- 否：你自己稍后提交
```

---

## 来源 / Origin#

本工作流基于 [GPQS (General Project Quality Standard)](https://github.com/firecangshu/gpqs-standard) 实现。

GPQS 基于 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 二创。

---

## 许可证 / License#

MIT License#

---

## 致谢 / Acknowledgments#

感谢 [AVJ (Agent Value Judgment)](https://gitcode.com/team_kaixin/agent-value-judge) 提供原始评分框架。

感谢 [GPQS](https://github.com/firecangshu/gpqs-standard) 提供通用项目质量评估标准。
