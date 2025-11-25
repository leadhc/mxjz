/*
 * 应用入口文件 main.js
 * 功能：初始化Vue应用实例，配置全局插件和状态管理
 *
 * 主要功能：
 * 1. 导入应用根组件App
 * 2. 配置Pinia状态管理
 * 3. 兼容Vue 2和Vue 3的不同初始化方式
 * 4. 导出createApp函数（Vue 3模式）
 */

// 导入应用根组件
import App from './App'
// 导入并创建Pinia实例用于状态管理
import { createPinia } from 'pinia'

const pinia = createPinia()

// Vue 2模式下的应用初始化（条件编译）
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor' // 导入Promise适配器，用于兼容回调API
Vue.config.productionTip = false // 关闭生产环境提示
App.mpType = 'app' // 设置应用类型为小程序
const app = new Vue({
  ...App
})
app.$mount() // 挂载应用
// #endif

// Vue 3模式下的应用初始化（条件编译）
// #ifdef VUE3
import { createSSRApp } from 'vue' // 导入Vue 3的SSR应用创建函数

/**
 * 创建Vue 3应用实例
 * @returns {Object} 包含app实例的对象
 */
export function createApp() {
  const app = createSSRApp(App) // 创建SSR应用实例
  app.use(pinia) // 使用Pinia状态管理
  return {
    app
  }
}
// #endif
