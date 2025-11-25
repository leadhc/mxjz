/**
 * 本地存储工具文件 storage.js
 * 提供统一的本地存储操作接口，支持微信小程序环境
 * 
 * 功能说明：
 * - 封装本地存储的设置操作
 * - 封装本地存储的获取操作
 * - 自动处理JSON序列化和反序列化
 * - 适配微信小程序环境
 */

import { HISTORYSEARCH } from '@/constant/index.js'  // 导入常量定义

/**
 * 将数据存储到本地存储中
 * @param {string} key - 存储的键名
 * @param {*} val - 要存储的值，可以是任意类型（会自动序列化为JSON字符串）
 */
export const setStorage = (key, val) => {
  // 判断值是否为字符串，如果不是则转换为JSON字符串
  const value = typeof val === 'string' ? val : JSON.stringify(val)
  // 微信小程序环境条件编译
  // #ifdef MP-WEIXIN
  uni.setStorageSync(key, value)
  // #endif
}

/**
 * 从本地存储中获取数据
 * @param {string} key - 存储的键名
 * @returns {*} - 获取的值，如果值是JSON字符串会自动解析，否则返回原始值
 */
export const getStorage = (key) => {
  // 微信小程序环境条件编译
  // #ifdef MP-WEIXIN
  const value = uni.getStorageSync(key)
  // 如果没有值，返回null
  if (!value) return null
  // 尝试解析JSON字符串
  try {
    return JSON.parse(value)
  } catch (e) {
    // 如果解析失败，返回原始值
    return value
  }

  // #endif
}

/**
 * 使用说明：
 * 1. 存储数据：setStorage('userInfo', { name: '张三', age: 20 })
 * 2. 获取数据：const userInfo = getStorage('userInfo')
 * 3. 该工具会自动处理JSON序列化和反序列化
 * 4. 仅在微信小程序环境下生效
 */
