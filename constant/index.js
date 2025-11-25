/**
 * 常量定义文件 constant/index.js
 * 集中管理应用中使用的各种常量，便于统一维护和修改
 * 
 * 常量分类：
 * - 存储键名常量：用于本地存储的键名
 * - 通知类型常量：用于通知系统的类型定义
 */

/**
 * 历史搜索记录的本地存储键名
 * 用于在本地存储和获取用户的搜索历史记录
 */
export const HISTORYSEARCH = 'historySearch'

/**
 * 通知相关常量对象
 * 定义应用中使用的各种通知类型
 */
export const NOTIFY = {
  ACCT_TIME: 'acct_time',  // 记账时间通知
  REPORT_TIME: 'report_time',  // 报告时间通知
  DND: 'dnd',  // 免打扰模式
  PUSH: 'push',  // 推送通知
  ACCT: 'acct',  // 记账相关通知
  REPORT: 'report',  // 报告相关通知
  BUDGET: 'budget',  // 预算相关通知
  COMMUNITY: 'community',  // 社区相关通知
  LIKE: 'like',  // 点赞通知
  COMMENT: 'comment'  // 评论通知
}

/**
 * 常量使用说明：
 * 1. 本地存储：使用 HISTORYSEARCH 作为键名存储搜索历史
 * 2. 通知系统：使用 NOTIFY 对象中的常量来区分不同类型的通知
 * 3. 在代码中引用这些常量时，直接从 @/constant/index.js 导入
 */
