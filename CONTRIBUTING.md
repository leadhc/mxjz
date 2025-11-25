# 贡献指南

感谢您考虑为妙享记账小程序项目贡献代码！这份指南将帮助您了解如何有效地参与到项目开发中来。

## 开发环境搭建

### 前置条件

- Node.js >= 14.0.0
- npm >= 6.0.0
- HBuilderX（推荐，用于uni-app开发）
- 微信开发者工具（用于小程序预览和调试）
- Git

### 安装步骤

1. **Fork 项目**
   在 GitHub 上点击 "Fork" 按钮，将项目复制到您的 GitHub 账号下。

2. **克隆项目**

   ```bash
   git clone https://github.com/YOUR_USERNAME/mxjz.git
   cd mxjz
   ```

3. **安装依赖**

   ```bash
   npm install
   ```

4. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 开发规范

### 代码规范

- 遵循项目现有的代码风格
- 所有代码必须通过 ESLint 检查
- 使用 Prettier 进行代码格式化
- 变量和函数命名采用小驼峰命名法
- 组件命名采用 PascalCase 命名法

### 提交规范

我们使用 commitlint 来规范提交信息，请按照以下格式进行提交：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型 (type)

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构（不新增功能或修复bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

#### 作用域 (scope)

可选，用于指明本次提交影响的范围，如：

- 页面：`index`, `account`, `forum`, `profile`
- 组件：`dialog`, `classifyCard`, `tranBill`
- 功能：`budget`, `transaction`, `article`

#### 主题 (subject)

简短描述本次提交的内容，不超过50个字符。

#### 正文 (body)

详细描述本次提交的内容，包括：

- 为什么要做这个修改
- 如何实现的
- 有什么影响

#### 页脚 (footer)

用于关闭issue或添加重要说明，如：

- `Closes #123`
- `BREAKING CHANGE: ...`

### 示例提交信息

```
feat(account): 添加位置选择功能

在记账页面增加了位置选择功能，用户可以选择消费地点。
实现了与高德地图API的集成，支持获取当前位置。

Closes #42
```

## 开发流程

1. **选择任务**
   - 从 GitHub Issues 中选择一个感兴趣的任务
   - 或提出新的功能建议或bug报告

2. **创建分支**
   - 从 `main` 分支创建新的功能分支
   - 分支命名格式：`feature/功能名称` 或 `fix/问题描述`

3. **编写代码**
   - 实现功能或修复bug
   - 确保代码符合项目规范
   - 为新功能添加适当的注释

4. **测试**
   - 在微信开发者工具中测试功能
   - 确保在不同尺寸的设备上都能正常工作
   - 测试边界情况

5. **提交代码**
   - 使用规范的提交信息
   - 推送代码到您的 GitHub 仓库

6. **创建 Pull Request**
   - 选择目标分支（通常是 `main`）
   - 填写详细的 Pull Request 描述
   - 关联相关的 Issues

7. **代码审查**
   - 项目维护者会对您的代码进行审查
   - 根据反馈进行必要的修改
   - 当审查通过后，您的代码将被合并到主分支

## 行为准则

我们期望所有参与者都能遵守以下行为准则：

- 尊重他人，包容不同的观点和经验
- 接受建设性批评，保持专业态度
- 关注社区的最佳利益
- 对新手友好，提供帮助和指导

## 问题报告

如果您发现了bug或有新功能建议，请在 GitHub Issues 中提交：

- **Bug报告**：
  - 清晰描述问题现象
  - 提供复现步骤
  - 说明您的环境（设备、系统版本、微信版本等）
  - 如果可能，提供截图或录屏

- **功能建议**：
  - 清晰描述您希望添加的功能
  - 说明这个功能的价值和使用场景
  - 如果可能，提供设计建议或示例

## 联系我们

如果您有任何问题或建议，可以通过以下方式联系我们：

- GitHub Issues: https://github.com/your-username/mxjz/issues
- Email: [your-email@example.com]

再次感谢您的贡献！ 🎉
