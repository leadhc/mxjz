<!--
 * 应用根组件 App.vue
 * 功能：作为整个小程序的根组件，管理全局生命周期和样式
 * 
 * 主要功能：
 * 1. 定义应用级别的生命周期函数
 * 2. 配置全局样式和字体
 * 3. 引入自定义字体图标
 -->

<script>
export default {
  /**
   * 应用启动时触发的生命周期函数
   * 功能：初始化应用数据、加载用户信息、检查更新等
   */
  onLaunch: function () {
    console.log('App Launch')
  },

  /**
   * 应用显示在前台时触发的生命周期函数
   * 功能：恢复应用状态、刷新数据等
   */
  onShow: function () {
    console.log('App Show')
  },

  /**
   * 应用隐藏到后台时触发的生命周期函数
   * 功能：保存应用状态、暂停定时器等
   */
  onHide: function () {
    console.log('App Hide')
    console.log('测试lint-staged')
  }
}
</script>

<style lang="scss">
@import '/styles/qlEditor.scss'; // 引入富文本编辑器样式

/*每个页面公共css */

/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */

/**
	 * 引入自定义字体图标
	 * 字体图标库：iconfont（阿里巴巴矢量图标库）
	 * Project id: 5063171
	 */
@font-face {
  font-family: 'iconfont'; /* Project id 5063171 */
  src: url('@/static/iconfont/iconfont.ttf') format('truetype');
}
</style>
