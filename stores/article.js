/**
 * 文章状态管理文件 article.js
 * 使用 Pinia 进行状态管理，用于管理文章相关的状态
 *
 * 功能说明：
 * - 存储和管理文章详情信息
 * - 提供设置文章详情的方法
 */

import { defineStore } from 'pinia' // 导入 Pinia 的 defineStore 函数
import { ref } from 'vue' // 导入 Vue 3 的响应式引用函数

/**
 * 文章状态管理 Store
 * @module articleStore
 */
export const articleStore = defineStore('article', () => {
  /**
   * 文章详情对象
   * @type {ref<Object>} - 响应式文章详情对象，初始值为空字符串
   */
  const articleDetail = ref('')

  /**
   * 设置文章详情
   * @param {Object} val - 文章详情对象
   */
  const setArticleDetail = (val) => {
    articleDetail.value = val
  }

  return {
    articleDetail, // 文章详情
    setArticleDetail // 设置文章详情的方法
  }
})
