/**
 * 用户状态管理文件 user.js
 * 使用 Pinia 进行状态管理，用于管理用户信息、登录状态和相关操作
 *
 * 功能说明：
 * - 存储和管理用户信息
 * - 提供登录、登出功能
 * - 检查用户登录状态
 * - 用户信息持久化存储
 */

import { defineStore } from 'pinia' // 导入 Pinia 的 defineStore 函数
import { ref } from 'vue' // 导入 Vue 3 的响应式引用函数
import { showToast } from '@/untils/index.js' // 导入提示框工具函数
import { setStorage, getStorage } from '../untils/storage.js' // 导入本地存储工具函数

/**
 * 用户状态管理 Store
 * @module userStore
 */
export const userStore = defineStore('user', () => {
  /**
   * 用户信息对象
   * @type {ref<Object>} - 响应式用户信息对象，从本地存储初始化或为空字符串
   */
  const userInfo = ref(getStorage('user') || '')

  /**
   * 设置用户信息
   * @param {Object} val - 用户信息对象
   */
  const setUser = (val) => {
    userInfo.value = val
  }

  /**
   * 将用户信息存储到本地
   */
  const storageUser = () => {
    setStorage('user', userInfo.value)
  }

  /**
   * 用户登录方法
   * 使用微信小程序的 getUserProfile API 获取用户信息
   * @async
   */
  const login = async () => {
    await uni.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        // 设置用户信息，添加额外字段
        setUser({ ...res.userInfo, phone: null, email: null, birthday: null })
        // 存储用户信息到本地
        storageUser()
        // 显示登录成功提示
        showToast('模拟登录', 'success')
        console.log(userInfo.value, 'pinia')
        // 执行登录请求（实际项目中会调用后端API）
      },
      fail: () => {
        // 显示取消登录提示
        showToast('取消登录', 'error')
      }
    })
  }

  /**
   * 检查用户是否已登录
   * 如果未登录，显示提示弹窗并提供跳转登录页选项
   * @returns {boolean} - 是否已登录
   */
  const isLogin = () => {
    if (!userInfo.value) {
      uni.showModal({
        title: '您还未登录',
        content: '点击确认跳转至登录页',
        success: async (res) => {
          // 这里不再模拟登录逻辑
          if (res.confirm) {
            uni.switchTab({ url: '/pages/profile/profile' }) // 跳转登录页
          }
        }
      })

      return false
    }
    return true
  }

  /**
   * 用户登出方法
   * 清空用户信息并清除本地存储
   */
  const loginOut = () => {
    userInfo.value = ''
    setStorage('user', '')
  }

  return {
    userInfo, // 用户信息
    setUser, // 设置用户信息的方法
    isLogin, // 检查登录状态的方法
    login, // 登录方法
    loginOut, // 登出方法
    storageUser // 存储用户信息到本地的方法
  }
})
