// .cz-config.js
module.exports = {
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: BUG修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式调整（不影响逻辑）' },
    { value: 'refactor', name: 'refactor: 代码重构' },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 添加或修改测试' },
    { value: 'build', name: 'build: 构建流程或依赖修改' },
    { value: 'ci', name: 'ci: CI配置修改' },
    { value: 'chore', name: 'chore: 其他杂项（如脚手架更新）' },
    { value: 'revert', name: 'revert: 回退提交' }
  ],
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入修改范围（可选）:',
    subject: '请简要描述提交（必填）:',
    body: '请输入详细描述（可选）:',
    footer: '请输入关联的 issue（可选）:',
    confirmCommit: '确认提交？'
  },
  skipQuestions: ['body', 'footer'],
  subjectLimit: 72
}
