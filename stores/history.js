/**
 * 历史搜索状态管理文件 history.js
 * 使用 Pinia 进行状态管理，用于管理用户的历史搜索记录
 *
 * 功能说明：
 * - 存储和管理历史搜索记录列表
 * - 提供设置、删除和清空历史搜索记录的方法
 * - 与本地存储同步，确保数据持久化
 */

import { defineStore } from 'pinia' // 导入 Pinia 的 defineStore 函数
import { ref } from 'vue' // 导入 Vue 3 的响应式引用函数
import { getStorage, setStorage } from '@/untils/storage.js' // 导入本地存储工具函数
import { HISTORYSEARCH } from '@/constant/index.js' // 导入历史搜索常量

/**
 * 历史搜索状态管理 Store
 * @module historyStore
 */
export const historyStore = defineStore('history', () => {
  /**
   * 历史搜索记录列表
   * @type {ref<Array>} - 响应式历史搜索记录数组，从本地存储初始化或为空数组
   */
  const historySearch = ref(getStorage(HISTORYSEARCH) || [])

  /**
   * 设置历史搜索记录
   * @param {Array} val - 历史搜索记录数组
   */
  const setHistorySearch = (val) => {
    historySearch.value = val
    setStorage(HISTORYSEARCH, val)
  }

  /**
   * 删除指定的历史搜索记录
   * @param {string} val - 要删除的搜索记录
   */
  const removeHistorySearch = (val) => {
    const newHistroy = historySearch.value.filter((item) => item !== val)
    historySearch.value = newHistroy
    setStorage(HISTORYSEARCH, newHistroy)
  }

  /**
   * 清空所有历史搜索记录
   */
  const clearHistorySearch = () => {
    historySearch.value = []
    setStorage(HISTORYSEARCH, [])
  }

  return {
    historySearch, // 历史搜索记录列表
    setHistorySearch, // 设置历史搜索记录的方法
    removeHistorySearch, // 删除指定历史搜索记录的方法
    clearHistorySearch // 清空所有历史搜索记录的方法
  }
})
