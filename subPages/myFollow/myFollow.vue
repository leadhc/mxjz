<template>
  <!-- 关注页面主容器 -->
  <view class="follow-page">
    <!-- 我关注的人区域 -->
    <view class="section myfollow">
      <!-- 区域头部信息 -->
      <view class="section-header">
        <text class="section-title">我关注的人</text>
        <text class="section-subtitle">
          共关注 {{ followingUsers.length }} 人
        </text>
      </view>

      <!-- 关注用户列表 -->
      <view class="user-list">
        <view v-for="user in followingUsers" :key="user.id" class="user-item">
          <articleAvatar
            :data="user"
            :activeFollow="user.follow"
            :isFollow="true"
            @follow="clickFollow(user)"
          >
            <!-- 默认插槽：显示用户描述 -->
            <template #default>
              <view style="font-size: 25rpx">{{ user.desc }}</view>
            </template>
          </articleAvatar>
        </view>
      </view>
    </view>

    <!-- 推荐关注区域 -->
    <view class="section">
      <!-- 区域头部信息 -->
      <view class="section-header">
        <text class="section-title">推荐关注</text>
      </view>

      <!-- 推荐用户列表 -->
      <view class="user-list">
        <view v-for="user in recommendedUsers" :key="user.id" class="user-item">
          <articleAvatar
            :data="user"
            :activeFollow="user.follow"
            :isFollow="true"
            @follow="clickFollow(user)"
          >
            <!-- 默认插槽：显示用户描述 -->
            <template #default>
              <view style="font-size: 25rpx">{{ user.desc }}</view>
            </template>
          </articleAvatar>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 关注页面 myFollow.vue
 * 功能说明：
 * - 展示用户关注列表
 * - 展示推荐关注列表
 * - 支持关注/取消关注功能
 */

// 导入组件
import articleAvatar from '@/components/articleAvatar/articleAvatar.vue' // 作者头像组件，用于显示用户信息和关注按钮

// 导入模拟数据
import { followingUsers, recommendedUsers } from '@/MXJZdata/followData.js' // 关注和推荐用户数据

/**
 * 处理关注/取消关注操作
 * @param {Object} user - 被点击的用户对象
 * @param {number} user.id - 用户ID
 * @param {string} user.name - 用户名称
 * @param {string} user.avatar - 用户头像URL
 * @param {boolean} user.follow - 当前关注状态
 * @param {string} user.desc - 用户描述
 */
const clickFollow = (user) => {
  // 切换关注状态
  user.follow = !user.follow

  // 提示用户操作结果
  uni.showToast({
    title: user.follow ? '关注成功' : '取消关注',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
/**
 * 关注页面样式定义
 * 样式结构：
 * - 页面主容器样式：整体布局和背景
 * - 区域通用样式：关注和推荐区域的共同样式
 * - 我关注的人区域：特殊的边距样式
 * - 区域头部样式：标题和副标题的样式
 * - 用户列表样式：用户项的排列和分隔
 * - 用户项样式：单个用户的边距和边框
 */

/* 页面主容器 */
.follow-page {
  background-color: #f9fafb; // 页面背景色，使用浅灰色背景
  color: $gray-800; // 文字颜色，使用深灰色
  min-height: 100vh; // 最小高度为视口高度，确保内容填满整个屏幕
  padding: $spacing-page; // 容器内边距，使用统一变量管理
}

/* 区域通用样式 */
.section {
  background-color: $white; // 区域背景色，使用白色突出内容
  border-radius: 24rpx; // 圆角边框，提升视觉柔和度
  overflow: hidden; // 隐藏溢出内容
  padding: $spacing-page; // 区域内边距，使用统一变量管理
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05); // 阴影效果，增加层次感
}

/* 我关注的人区域 */
.myfollow {
  margin-bottom: 20rpx; // 底部外边距，与推荐关注区域分隔
}

/* 区域头部样式 */
.section-header {
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列标题和副标题
  padding-bottom: 30rpx; // 底部内边距，与用户列表分隔
  border-bottom: 1px solid #f3f4f6; // 底部边框线，分隔头部和内容
}

/* 区域标题 */
.section-title {
  font-size: 30rpx; // 字体大小，使用较大字号突出显示
  font-weight: 600; // 字重，使用粗体增强视觉效果
  color: $gray-800; // 颜色，使用深灰色确保可读性
}

/* 区域副标题 */
.section-subtitle {
  font-size: 24rpx; // 字体大小，使用较小字号作为辅助信息
  color: $gray-500; // 颜色，使用浅灰色作为辅助信息
  margin-top: 8rpx; // 顶部外边距，与标题分隔
}

/* 用户列表样式 */
.user-list {
  // 列表容器，子元素自动排列
}

/* 用户项样式 */
.user-item {
  padding-top: 30rpx; // 顶部内边距，与上一个用户项分隔
  border-bottom: 1px solid #f1f5f9; // 底部边框线，分隔用户项
  transition: background-color 0.3s ease; // 过渡动画，提升交互体验

  &:last-child {
    // 最后一个用户项特殊样式
    border-bottom: none; // 最后一个用户项无边框
  }
}
</style>
