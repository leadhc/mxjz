/**
 * 交易记录状态管理文件 transaction.js
 * 使用 Pinia 进行状态管理，用于在不同组件间共享当前选中的交易记录
 * 
 * 功能说明：
 * - 存储当前选中的交易记录
 * - 提供设置交易记录的方法
 * - 支持在记账详情、编辑等页面间传递交易数据
 */

import { defineStore } from 'pinia'  // 导入 Pinia 的 defineStore 函数
import { ref } from 'vue'  // 导入 Vue 3 的响应式引用函数

/**
 * 交易记录状态管理 Store
 * @module transactionStore
 */
export const transactionStore = defineStore('transactions', () => {
  /**
   * 当前选中的交易记录对象
   * @type {ref<Object>} - 响应式交易记录对象
   */
  const transaction = ref({})

  /**
   * 设置当前交易记录
   * @param {Object} val - 交易记录对象
   */
  const setTransaction = (val) => {
    transaction.value = val
  }

  return {
    transaction,  // 导出交易记录状态
    setTransaction  // 导出设置交易记录的方法
  }
})
