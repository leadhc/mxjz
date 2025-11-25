<template>
  <!-- 我的评论页面主容器：整个页面的根容器，设置页面级别的样式和布局 -->
  <view class="comment-page">
    <view class="content-section">
      <view class="section-header">
        <text class="section-title">我的评论</text>

        <text
          class="section-subtitle"
          :class="{ 'zero-count': comments.length === 0 }"
        >
          共发表 {{ comments.length }} 条评论
        </text>
      </view>

      <view class="comment-list">
        <view v-for="item in comments" :key="item.id" class="comment-item">
          <view @click="newCommentPage"><commentsListVue :data="item" /></view>

          <view class="comment-footer" @click="newCommentPage">
            <articleIconVue
              :isColl="false"
              :data="{ like: item.likes, comment: '回复' }"
            />
          </view>
        </view>

        <view v-if="comments.length === 0" class="empty-state">
          <text class="empty-text">暂无评论记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 我的评论页面 myCommon.vue
 * 功能：
 * - 展示用户发表的所有评论列表
 * - 显示评论总数统计
 * - 点击评论可跳转到对应的文章详情页
 * - 支持评论互动功能（点赞、回复）
 */

// 导入必要的组件
import commentsListVue from '@/components/commentsList/commentsList.vue' // 评论列表组件，用于显示单条评论内容（作者、内容、时间等）
import articleIconVue from '@/components/articleIcon/articleIcon.vue' // 文章互动图标组件，用于展示点赞和回复功能

// 导入数据和工具函数
import { postData } from '@/MXJZdata/article.js' // 文章数据，用于模拟跳转到文章详情页
import { comments } from '@/MXJZdata/commentsData.js' // 评论数据，包含用户发表的所有评论
import { showToast } from '@/untils/index.js' // 提示框工具函数，用于显示操作提示
import { articleStore } from '@/stores/article.js' // 文章状态管理，用于在页面间传递文章数据

// 获取文章状态管理实例：用于在组件间共享文章数据
const useArticleStore = articleStore()

/**
 * 跳转到评论对应的文章详情页
 * 功能：
 * - 显示跳转提示信息
 * - 1秒后执行页面跳转
 * - 将文章数据存入状态管理供详情页使用
 *
 * @returns {void}
 */
const newCommentPage = () => {
  // 显示操作提示，告知用户即将跳转
  showToast('模拟跳转至评论文章', 'success')

  // 延迟1秒执行跳转，给用户足够的时间看到提示信息
  setTimeout(() => {
    // 执行页面跳转，使用uni.navigateTo进行非覆盖式跳转
    uni.navigateTo({
      url: '/subPages/articleDetail/articleDetail', // 目标页面路径：文章详情页
      success: () => {
        // 跳转成功后，将文章数据存入Pinia store，供详情页使用
        // 这里使用固定的测试数据，实际应用中应该使用与评论对应的真实文章数据
        useArticleStore.setArticleDetail(postData.value)
      }
    })
  }, 1000)
}
</script>

<style lang="scss" scoped>
/**
 * 我的评论页面样式定义
 * 样式结构：
 * - 页面主容器样式：整体布局和背景设置
 * - 内容区域样式：评论区域的容器样式和阴影效果
 * - 区域头部样式：标题和统计信息的字体、颜色等样式
 * - 评论列表样式：评论列表的整体布局和间距
 * - 评论项样式：单条评论的样式和交互效果
 * - 空状态样式：当没有评论时的显示样式
 */

// 页面主容器样式：设置页面的整体背景色、内边距和最小高度
.comment-page {
  color: $gray-800;
  min-height: 100vh;
  padding: $spacing-page;
  background-color: #f9fafb;
}

// 内容区域样式：评论列表的主要容器，设置背景色、圆角和阴影效果
.content-section {
  background-color: $white;
  border-radius: 24rpx;
  overflow: hidden;
  padding: $spacing-page;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// 区域头部样式：设置区域标题和统计信息的布局
.section-header {
  display: flex; // 弹性布局：便于灵活对齐和排列元素
  flex-direction: column; // 垂直排列：标题在上，统计信息在下
  padding-bottom: 30rpx; // 底部内边距：与下方评论列表分隔
  border-bottom: 1px solid #f3f4f6; // 底部边框线：视觉上分隔区域头部和内容
}

// 区域标题样式：设置标题的字体大小、粗细和颜色
.section-title {
  font-size: 30rpx; // 标题字体大小：适中大小，突出显示
  font-weight: 600; // 标题字重：使用较粗字体，增强视觉层次
  color: $gray-800; // 标题颜色：深灰色，与页面主要文字颜色保持一致
}

// 评论统计信息样式：设置统计信息的字体大小、颜色和边距
.section-subtitle {
  font-size: 24rpx; // 副标题字体大小：小于标题，作为辅助信息
  color: $gray-500; // 副标题颜色：浅灰色，与标题形成对比
  margin-top: 8rpx; // 顶部外边距：与标题保持适当距离，增强可读性

  // 评论数为零时的样式：当用户没有发表评论时应用的特殊样式
  &.zero-count {
    color: $gray-300; // 使用更浅的灰色：表示无数据状态
    font-style: italic; // 斜体样式：进一步区分无数据状态，增强视觉提示
  }
}

// 评论项样式：单条评论的样式，包括内边距、边框和交互效果
.comment-item {
  padding: 30rpx 0; // 上下内边距：增加元素间距，提高可读性
  border-bottom: 1px solid $gray-200; // 底部边框线：分隔评论项，增强视觉层次
  transition: background-color 0.3s ease; // 背景色过渡效果：提升交互体验，使操作更加流畅

  // 最后一个评论项无边框线：避免冗余分割线，保持界面整洁
  &:last-child {
    border-bottom: none; // 移除最后一项的边框线：避免在列表末尾出现多余的分割线
  }

  // 评论底部操作区域样式：设置评论互动功能区域的边距
  .comment-footer {
    margin-top: 10rpx; // 顶部外边距：与评论内容保持适当距离，增强可读性
  }
}

// 空状态样式：当用户没有发表评论时显示的提示区域样式
.empty-state {
  padding: 60rpx 0; // 上下内边距：增加元素高度，使提示信息更加醒目
  display: flex; // 弹性布局：便于居中内容
  justify-content: center; // 水平居中：将提示文字置于容器中间
  align-items: center; // 垂直居中：将提示文字置于容器中间
}

// 空状态文字样式：设置提示文字的字体大小和颜色
.empty-text {
  font-size: 28rpx; // 文字大小：适中大小，确保清晰可读
  color: $gray-400; // 文字颜色：浅灰色，表示无数据状态
}
</style>
