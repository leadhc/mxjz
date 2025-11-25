<template>
  <view class="search-result-page">
    <!-- 搜索框区域 -->
    <view class="search">
      <!-- 搜索输入框组件容器 -->
      <view class="search-bar" :style="{ borderColor: inputFocusStyle }">
        <!-- 搜索组件 -->
        <searchVue
          @lfocus="parentFocus"
          @lblur="parentBlur"
          @lconfirm="parentConfirm"
          v-model="inputModel"
          :isInput="true"
          size="32"
          placeholder="搜索话题、帖子"
        >
          <!-- 清除按钮插槽 -->
          <template #default>
            <view @click="clearInput">
              <!-- 清除图标，仅在有输入内容时显示 -->
              <iconsVUe
                v-if="inputModel"
                iconType="''"
                iconSize="28"
                iconUcode="e631"
                iconColor="#3b82f6"
              ></iconsVUe>
            </view>
          </template>
        </searchVue>
      </view>

      <!-- 搜索结果提示文字 -->
      <view class="result-header">
        <text>共找到 3 条关于 "{{ inputModel }}" 的结果</text>
      </view>
    </view>

    <!-- 文章列表（使用 scroll-view 实现局部滚动） -->
    <scroll-view class="article-list" scroll-y>
      <!-- 文章卡片项 -->
      <view class="post-card card" v-for="post in basePosts" :key="post.id">
        <!-- 文章内容卡片，点击跳转详情 -->
        <view @click="viewPostDetail" class="article">
          <articleCardVue :item="post"></articleCardVue>
        </view>
        <!-- 文章互动图标组件 -->
        <articleIconVue
          @like="clickLike"
          @common="clickCommon"
          @collect="clickCollect"
          :data="post"
        ></articleIconVue>
      </view>
    </scroll-view>

    <!-- 返回顶部按钮 -->
    <view class="scroll-top" @click="scrollTop">
      <iconsVUe
        iconType="''"
        iconUcode="e62c"
        iconColor="#64748b"
        iconSize="60"
        iconBack="#dbeafe"
      ></iconsVUe>
    </view>
  </view>
</template>

<script setup>
/**
 * 搜索结果页面 searchResult.vue
 * 功能：
 * - 显示搜索输入框，支持实时输入和清除
 * - 展示搜索结果列表
 * - 支持文章详情查看、点赞、评论、收藏等互动功能
 * - 实现返回顶部功能
 * - 支持下拉刷新和上拉加载更多
 */

// 导入Vue相关
import { ref } from 'vue' // Vue响应式API
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app' // 页面生命周期钩子

// 导入组件
import searchVue from '@/components/search/search.vue' // 搜索组件
import articleCardVue from '@/components/articleCard/articleCard.vue' // 文章卡片组件
import articleIconVue from '@/components/articleIcon/articleIcon.vue' // 文章互动图标组件
import iconsVUe from '@/components/icons/icons.vue' // 图标组件

// 导入数据和工具
import { basePosts, postData } from '@/MXJZdata/article' // 文章数据
import { articleStore } from '@/stores/article.js' // 文章状态管理
import { userStore } from '@/stores/user' // 用户状态管理
import { showToast } from '/untils/index.js' // 提示框工具函数

// 搜索输入框的绑定值
const inputModel = ref('')

// 搜索框边框颜色（用于聚焦/失焦状态切换）
const inputFocusStyle = ref('#e5e7eb')

// 获取状态管理实例
const useArticleStore = articleStore()
const useUserStore = userStore()

/**
 * 搜索框获得焦点时的处理函数
 * 功能：将搜索框边框颜色设置为蓝色
 */
const parentFocus = () => {
  inputFocusStyle.value = '#3b82f6'
}

/**
 * 搜索框失去焦点时的处理函数
 * 功能：将搜索框边框颜色恢复为默认灰色
 */
const parentBlur = () => {
  inputFocusStyle.value = '#e5e7eb'
}

/**
 * 清空搜索输入框内容的处理函数
 * 功能：将输入框绑定值设置为空字符串
 */
const clearInput = () => {
  inputModel.value = ''
}

/**
 * 用户确认搜索时的处理函数
 * 功能：显示搜索提示，清空输入框
 */
const parentConfirm = () => {
  uni.showToast({
    title: '模拟从新请求数据',
    icon: 'success'
  })
  inputModel.value = ''
}

/**
 * 跳转到文章详情页的处理函数
 * 功能：
 * - 执行页面跳转
 * - 将文章数据存入状态管理供详情页使用
 */
const viewPostDetail = () => {
  // 注：此处 postData 是固定测试数据
  uni.navigateTo({
    url: '/subPages/articleDetail/articleDetail',
    success: () => {
      // 导航成功后，将帖子详情存入 Pinia store，供详情页读取
      useArticleStore.setArticleDetail(postData.value)
    }
  })
}

/**
 * 点赞操作的处理函数
 * 功能：
 * - 检查用户登录状态
 * - 显示点赞提示
 */
const clickLike = () => {
  if (!useUserStore.isLogin()) return // 未登录则返回
  showToast('模拟点赞')
}

/**
 * 评论操作的处理函数
 * 功能：
 * - 检查用户登录状态
 * - 跳转到文章详情页进行评论
 */
const clickCommon = () => {
  if (!useUserStore.isLogin()) return // 未登录则返回
  uni.navigateTo({
    url: '/subPages/articleDetail/articleDetail',
    success: () => {
      useArticleStore.setArticleDetail(postData.value)
    }
  })
}

/**
 * 收藏操作的处理函数
 * 功能：
 * - 检查用户登录状态
 * - 显示收藏提示
 */
const clickCollect = () => {
  if (!useUserStore.isLogin()) return // 未登录则返回
  showToast('模拟收藏')
}

/**
 * 滚动到页面顶部的处理函数
 * 功能：调用uni.pageScrollTo API实现页面滚动到顶部
 */
const scrollTop = () => {
  uni.pageScrollTo({ scrollTop: 0 })
}

/**
 * 页面加载时的生命周期钩子
 * @param {Object} option - 路由参数
 * 功能：获取URL参数中的搜索关键词并设置到输入框
 */
onLoad((option) => {
  inputModel.value = option.value
})

/**
 * 下拉刷新事件处理函数
 * 功能：
 * - 显示刷新提示
 * - 模拟数据刷新延迟
 * - 停止下拉刷新动画
 */
onPullDownRefresh(() => {
  showToast('模拟刷新数据')
  setTimeout(() => {
    uni.stopPullDownRefresh() // 必须调用以关闭 loading 动画
  }, 2000)
})

/**
 * 上拉触底加载更多事件处理函数
 * 功能：
 * - 显示加载更多提示
 * - 模拟加载延迟
 * - 实际项目中可在此处追加数据
 */
onReachBottom(() => {
  showToast('模拟加载更多')
  // 此处仅为模拟延迟
  setTimeout(() => {
    // 实际项目中可在此处追加数据
  }, 2000)
})
</script>

<style lang="scss">
/**
 * 搜索结果页面样式定义
 * 样式结构：
 * - 页面主容器样式：整体布局和背景
 * - 搜索区域样式：搜索框和结果提示的样式
 * - 文章列表样式：文章卡片的容器样式
 * - 文章卡片样式：单篇文章的样式和交互效果
 * - 返回顶部按钮样式：返回顶部按钮的定位和样式
 */
.search-result-page {
  background-color: #f8fafc; // 页面背景色
  color: #333; // 文字颜色
  min-height: 100vh; // 最小高度为视口高度
  padding: $spacing-page; // 页面内边距
  box-sizing: border-box; // 盒模型设置
}

// 搜索区域（固定在顶部）
.search {
  background: #f8fafc; // 背景色与页面一致
  width: 100%; // 宽度占满
  position: sticky; // 粘性定位，滚动时固定在顶部
  top: 0rpx; // 距离顶部距离
  left: 0rpx; // 距离左侧距离
  z-index: 999; // 层级最高，确保不被遮挡
  padding-bottom: 0.1rpx; // 底部微小内边距，避免滚动时出现白边
  box-sizing: border-box; // 盒模型设置

  .search-bar {
    background-color: $white; // 搜索框背景色
    border-radius: 16rpx; // 圆角边框
    padding: 0 20rpx; // 左右内边距
    border: 2px solid #e5e7eb; // 边框样式
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 阴影效果
    position: relative; // 相对定位，用于内部元素定位
    height: 72rpx; // 搜索框高度
    margin-bottom: 20rpx; // 底部外边距
  }
}

// 搜索结果提示文字样式
.result-header {
  font-size: 28rpx; // 字体大小
  color: #666; // 文字颜色
  margin-bottom: 20rpx; // 底部外边距
  text-align: center; // 文字居中
}

// 文章列表容器（scroll-view 区域）
.article-list {
  width: 100%; // 宽度占满
  background-color: white; // 背景色
  overflow: hidden; // 隐藏溢出内容
}

// 文章卡片外层容器
.post-card {
  box-sizing: border-box; // 盒模型设置
  margin-bottom: $spacing-4; // 底部外边距
  padding: $spacing-page; // 内边距
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列
}

// 卡片通用样式
.card {
  background-color: $white; // 背景色
  border-radius: 24rpx; // 圆角边框
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 阴影效果
  transition: all 0.3s ease; // 过渡动画

  &:hover {
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1); // 悬停时阴影加深
    transform: translateY(-2rpx); // 悬停时轻微上浮
  }
}

// 返回顶部按钮定位
.scroll-top {
  position: fixed; // 固定定位
  right: 40rpx; // 距离右侧距离
  bottom: 350rpx; // 距离底部距离
  z-index: 999; // 层级最高，确保不被遮挡
}
</style>
