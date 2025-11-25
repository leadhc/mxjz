<template>
  <!-- 文章详情页面 -->
  <view class="post-detail-page">
    <view class="detail-container" v-if="useArticleStore.articleDetail">
      <!-- 文章内容卡片 -->
      <view class="post-content card">
        <!-- 作者信息（带发布时间） -->
        <articleAvatarVue
          :data="useArticleStore.articleDetail.author"
          :time="useArticleStore.articleDetail.time"
          :isFollow="true"
          :activeFollow="useArticleStore.articleDetail.author.follow"
          @follow="clickFollow"
        >
          <text style="font-size: 25rpx">时间</text>
        </articleAvatarVue>

        <!-- 文章标题 -->
        <text class="post-title">{{
          useArticleStore.articleDetail.title
        }}</text>

        <!-- 文章正文 -->
        <!-- 模拟数据，实际应该由后端返回，根据后端返回的数据进行标签选择 -->
        <view class="post-body">
          <text class="post-text">{{
            useArticleStore.articleDetail.content
          }}</text>
        </view>

        <!-- 阅读/点赞/评论统计 -->
        <view class="post-stats">
          <text class="stat-text"
            >{{ useArticleStore.articleDetail.viewCount }} 阅读</text
          >
          <text class="stat-separator">·</text>
          <text class="stat-text"
            >{{ useArticleStore.articleDetail.likeCount }} 点赞</text
          >
          <text class="stat-separator">·</text>
          <text class="stat-text"
            >{{ useArticleStore.articleDetail.commentCount }} 评论</text
          >
        </view>

        <!-- 互动操作栏（点赞、评论、收藏、分享） -->
        <view
          class="interaction-bar"
          v-if="useArticleStore.articleDetail.likeCount"
        >
          <articleIconVue
            @like="clickLike"
            @common="clickCommon"
            @collect="clickCollect"
            @share="clickShare"
            :acitveLike="useArticleStore.articleDetail.like"
            :activeCollect="useArticleStore.articleDetail.bookmarked"
            :data="{
              like: useArticleStore.articleDetail.likeCount,
              comment: useArticleStore.articleDetail.commentCount
            }"
            :isShare="true"
          />
        </view>
      </view>

      <!-- 作者信息卡片 -->
      <view class="author-card card">
        <articleAvatarVue
          :data="useArticleStore.articleDetail.author"
          :isLike="true"
          @follow="clickFollow"
        >
          <!-- 作者描述插槽 -->
          <template #default>
            <text class="author-tabs">{{
              useArticleStore.articleDetail.author.description
            }}</text>
          </template>
        </articleAvatarVue>

        <!-- 作者数据统计：文章数、粉丝数、获赞数 -->
        <view class="author-stats">
          <view class="author-stat">
            <text class="stat-number">{{
              useArticleStore.articleDetail.author.stats.posts
            }}</text>
            <text class="stat-label">文章</text>
          </view>
          <view class="author-stat">
            <text class="stat-number">{{
              useArticleStore.articleDetail.author.stats.followers
            }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="author-stat">
            <text class="stat-number">{{
              useArticleStore.articleDetail.author.stats.likes
            }}</text>
            <text class="stat-label">获赞</text>
          </view>
        </view>
      </view>

      <!-- 评论区域 -->
      <view class="comments-section card">
        <!-- 评论区域头部 -->
        <view class="section-header">
          <text class="section-title">评论</text>
          <text class="comment-count">{{
            useArticleStore.articleDetail.commentCount
          }}</text>
        </view>

        <!-- 评论输入触发器（点击弹出输入框） -->
        <view class="comment-input-wrapper">
          <image :src="currentUser.avatar" class="user-avatar" />
          <!-- 当前用户头像 -->
          <view class="comment-input-container" @click="openCommentPopup">
            <searchVue :is-input="false" placeholder="写下你的精彩评论" />
            <!-- 使用搜索组件作为评论输入占位符 -->
          </view>
        </view>

        <!-- 评论列表（静态演示数据） -->
        <view class="comments-list">
          <view
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <image :src="comment.author.avatar" class="comment-avatar" />
            <!-- 评论者头像 -->
            <view class="comment-content">
              <!-- 评论头部信息（作者和时间） -->
              <view class="comment-header">
                <text class="comment-author">{{ comment.author.name }}</text>
                <!-- 评论者名称 -->
                <text class="comment-time">{{ comment.time }}</text>
                <!-- 评论发布时间 -->
              </view>
              <!-- 评论内容 -->
              <text class="comment-text">{{ comment.content }}</text>
              <!-- 评论互动（点赞/回复） -->
              <view class="comment-actions">
                <articleIconVue
                  @like="clickLike"
                  @common="clickCommon"
                  :isColl="false"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多评论按钮（仅演示） -->
        <view v-if="hasMoreComments" class="load-more-comments">
          <button class="load-more-button" size="mini" @tap="loadMoreComments">
            <text class="load-text">加载更多评论</text>
            <text class="iconfont icon-chevron-down"></text>
          </button>
        </view>
      </view>

      <!-- 评论输入弹窗 -->
      <view class="popup-box">
        <uni-popup
          ref="popup"
          type="bottom"
          border-radius="10px 10px 0 0"
          maskBackgroundColor="transparent"
        >
          <view
            class="view"
            id="input"
            :style="{ paddingBottom: keyHeight + 'px' }"
          >
            <textarea
              class="textarea"
              v-model="commonValue"
              @keyboardheightchange="keyChange"
              :fixed="true"
              show-confirm-bar="{{false}}"
              placeholder="请输入内容"
            />
            <view class="btn-box">
              <button
                class="btn"
                :disabled="!commonValue"
                size="mini"
                @click="handleClear"
              >
                清除
              </button>
              <button
                class="btn"
                :disabled="!commonValue"
                size="mini"
                @click="handleSend"
              >
                发送
              </button>
            </view>
          </view>
        </uni-popup>
      </view>
    </view>

    <!-- 文章不存在时的占位（可选） -->
    <view v-else class="empty-state">
      <text>文章加载中...</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 文章详情页 articleDetail.vue
 * 功能：
 * - 展示文章内容、作者信息、评论列表
 * - 支持点赞/评论/收藏/分享等互动功能
 * - 支持关注作者
 * - 实现评论输入弹窗
 * - 适配软键盘高度
 * - 配置分享功能
 * 依赖：
 * - articleStore（文章状态管理）
 * - userStore（用户登录状态管理）
 */

// 导入Vue相关
import { ref, reactive } from 'vue' // Vue响应式API
import { onUnload, onShareAppMessage } from '@dcloudio/uni-app' // 页面生命周期钩子

// 导入组件
import articleAvatarVue from '@/components/articleAvatar/articleAvatar.vue' // 作者头像组件，用于显示作者信息和关注按钮
import articleIconVue from '@/components/articleIcon/articleIcon.vue' // 文章互动图标组件，提供点赞、评论、收藏、分享功能
import searchVue from '@/components/search/search.vue' // 搜索/评论输入组件，支持搜索和评论输入功能

// 导入状态管理和工具
import { userStore } from '@/stores/user' // 用户状态管理，用于检查登录状态和获取用户信息
import { articleStore } from '@/stores/article.js' // 文章状态管理，用于获取文章详情和管理文章相关状态
import { getDomRect, showToast } from '@/untils/index.js' // 工具函数，getDomRect用于获取DOM元素尺寸，showToast用于显示提示信息

// ==================== 响应式状态 ====================
/**
 * 文章状态管理实例
 */
const useArticleStore = articleStore()

/**
 * 用户状态管理实例
 */
const useUserStore = userStore()

/**
 * 评论弹窗引用
 */
const popup = ref(null)

/**
 * 评论输入内容
 */
const commonValue = ref('')

/**
 * 是否还有更多评论
 */
const hasMoreComments = ref(true)

/**
 * 软键盘高度（用于适配）
 */
const keyHeight = ref(0)

/**
 * 输入框高度（用于适配）
 */
const inputHeight = ref(0)

// 当前用户信息（模拟，实际应从 userStore 获取）
const currentUser = reactive({
  id: 1,
  name: '当前用户',
  avatar: 'https://s.coze.cn/image/avtwY8_nguI/'
})

// 评论列表（静态演示数据）
const comments = ref([
  {
    id: 1,
    content: '感谢分享，这些经验对我很有帮助！我也要开始记账了！',
    time: '1小时前',
    likeCount: 12,
    liked: false,
    author: {
      id: 2,
      name: '理财小白',
      avatar: 'https://s.coze.cn/image/dfBllufQCV0/'
    }
  },
  {
    id: 2,
    content: '记账确实是理财的第一步，很多人忽视了这一点。',
    time: '2小时前',
    likeCount: 8,
    liked: false,
    author: {
      id: 3,
      name: '投资达人',
      avatar: 'https://s.coze.cn/image/yPuOZECE2WI/'
    }
  },
  {
    id: 3,
    content: '想问一下，您用的是哪款记账App？有什么推荐的吗？',
    time: '3小时前',
    likeCount: 5,
    liked: false,
    author: {
      id: 4,
      name: '新手记账',
      avatar: 'https://s.coze.cn/image/gOoTV10QfDM/'
    }
  }
])

// ==================== 事件处理函数 ====================

/**
 * 打开评论输入弹窗
 * 功能：
 * - 检查用户登录状态
 * - 打开评论弹窗
 * - 获取输入框高度用于适配软键盘
 */
const openCommentPopup = () => {
  // 检查登录状态
  if (!useUserStore.isLogin()) return

  // 打开弹窗
  popup.value.open()

  // 延迟获取输入框高度，确保弹窗已渲染
  setTimeout(() => {
    getDomRect('#input').then((res) => {
      console.log(res.height, 'res')
      inputHeight.value = res.height
    })
  }, 10)
}

/**
 * 处理软键盘高度变化，适配输入框位置
 * @param {Object} e - 键盘高度变化事件对象
 * @param {Object} e.detail - 事件详情
 * @param {number} e.detail.height - 键盘高度（单位：px）
 */
const keyChange = (e) => {
  console.log(e.detail)
  if (e.detail.height) {
    // 软键盘弹出时，调整底部内边距
    keyHeight.value = e.detail.height - inputHeight.value - 30
  } else {
    // 软键盘收起时，恢复底部内边距
    keyHeight.value = 20
  }
}

/**
 * 清除评论输入内容
 */
const handleClear = () => {
  commonValue.value = ''
}

/**
 * 发送评论
 * 功能：
 * - 显示发送成功提示
 * - 清空输入内容
 * - 关闭评论弹窗
 */
const handleSend = () => {
  showToast('模拟发布评论')
  commonValue.value = ''
  popup.value.close()
}

/**
 * 关注/取消关注作者
 * 功能：
 * - 检查用户登录状态
 * - 切换作者的关注状态
 */
const clickFollow = () => {
  // 检查登录状态（内部应处理跳转或提示）
  if (!useUserStore.isLogin()) {
    return
  }

  // 切换关注状态
  useArticleStore.articleDetail.author.follow =
    !useArticleStore.articleDetail.author.follow
}

/**
 * 点赞/取消点赞文章
 * 功能：
 * - 检查用户登录状态
 * - 切换文章的点赞状态
 * - 显示操作结果提示
 */
const clickLike = () => {
  if (!useUserStore.isLogin()) {
    return
  }

  // 切换点赞状态
  useArticleStore.articleDetail.like = !useArticleStore.articleDetail.like
  showToast('模拟点赞')
}

/**
 * 发起评论
 * 功能：
 * - 检查用户登录状态
 * - 滚动到评论区域
 * - 打开评论输入弹窗
 */
const clickCommon = () => {
  if (!useUserStore.isLogin()) {
    return
  }

  // 滚动到评论区域
  uni.pageScrollTo({
    selector: '.comments-list',
    success: () => {
      // 滚动完成后打开评论弹窗
      openCommentPopup()
    }
  })
}

/**
 * 收藏/取消收藏文章
 * 功能：
 * - 检查用户登录状态
 * - 切换文章的收藏状态
 * - 显示操作结果提示
 */
const clickCollect = () => {
  if (!useUserStore.isLogin()) {
    return
  }

  // 切换收藏状态
  useArticleStore.articleDetail.bookmarked =
    !useArticleStore.articleDetail.bookmarked
  showToast('模拟收藏')
}

/**
 * 分享文章（空实现，可扩展）
 * 功能：实际可调用 uni.share 或自定义分享逻辑
 */
const clickShare = () => {
  // 实际可调用 uni.share 或自定义分享逻辑
  // 需要配置相关的第三方服务商
}

/**
 * 输入框聚焦时获取容器高度（用于适配软键盘）
 */
const handleFocus = () => {
  getDomRect('#input').then((res) => {
    console.log('评论输入框高度:', res.height)
  })
}

/**
 * 加载更多评论（演示用）
 * 功能：
 * - 设置无更多评论标记
 * - 显示提示信息
 */
const loadMoreComments = () => {
  hasMoreComments.value = false
  uni.showToast({ title: '已加载全部评论', icon: 'none' })
}

// ==================== 分享配置 ====================
/**
 * 配置微信/小程序右上角分享
 * @returns {Object} 分享配置对象
 */
onShareAppMessage(() => {
  const detail = useArticleStore.articleDetail
  return {
    title: detail?.title || '精彩文章推荐', // 分享标题
    path: '/subPages/articleDetail/articleDetail', // 分享路径
    desc: '这篇文章讲得太好了，推荐给大家看看！', // 分享描述
    success: () => {
      console.log('文章分享成功')
    }
  }
})

// ==================== 生命周期钩子 ====================
/**
 * 页面卸载时清空文章详情，避免跳转后残留
 */
onUnload(() => {
  useArticleStore.setArticleDetail(null)
})
</script>

<style lang="scss" scoped>
.post-detail-page {
  background-color: $gray-50;
  color: $gray-800;
  min-height: 100vh;
}

.detail-container {
  padding: $spacing-page;
  padding-top: 0rpx;
  padding-bottom: 80rpx;
}

.card {
  background-color: $white;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: $spacing-4;
  padding: $spacing-page;
}

.post-content {
  .post-title {
    font-size: $text-2xl;
    font-weight: 700;
    color: $gray-800;
    margin-bottom: $spacing-4;
    line-height: 1.4;
    display: block;
  }

  .post-body {
    margin-bottom: $spacing-4;
  }

  .post-text {
    font-size: $text-base;
    color: $gray-700;
    line-height: 1.6;
    display: block;
    margin-bottom: $spacing-4;
    white-space: pre-line;
  }

  .post-images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-3;
    margin-top: $spacing-4;
  }

  .post-image {
    width: 100%;
    height: 300rpx;
    border-radius: 12rpx;
  }

  .post-stats {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-4;
    font-size: $text-sm;
    color: $gray-500;
  }

  .stat-separator {
    margin: 0 $spacing-2;
  }
}

.interaction-bar {
  border-bottom: 2rpx solid $gray-100;
  padding: $spacing-4 0;
  margin: $spacing-4 0;
}

.author-card {
  .author-tabs {
    font-size: $text-xs;
  }

  .author-stats {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .author-stat {
    display: flex;
    flex-direction: column;
  }

  .stat-number {
    font-size: $text-lg;
    font-weight: 600;
    color: $gray-800;
    margin-bottom: $spacing-1;
  }

  .stat-label {
    font-size: $text-xs;
    color: $gray-500;
  }
}

.comments-section {
  padding-bottom: 70rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-4;
  }

  .section-title {
    font-size: $text-lg;
    font-weight: 500;
    color: $gray-700;
  }

  .comment-count {
    font-size: $text-sm;
    color: $gray-500;
  }
}

.comment-input-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-4;

  .user-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-right: $spacing-3;
  }

  .comment-input-container {
    height: 60rpx;
    flex: 1;
    display: flex;
    align-items: center;
    background-color: $gray-100;
    border-radius: 24rpx;
    padding: 0rpx $spacing-3;
    box-sizing: border-box;
  }
}

.comments-list .comment-item {
  display: flex;
  margin-bottom: $spacing-4;

  &:last-child {
    margin-bottom: 0;
  }

  .comment-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-right: $spacing-3;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-2;
  }

  .comment-author {
    font-size: $text-base;
    font-weight: 500;
    color: $gray-800;
  }

  .comment-time {
    font-size: $text-xs;
    color: $gray-500;
  }

  .comment-text {
    font-size: $text-base;
    color: $gray-700;
    line-height: 1.5;
    margin-bottom: $spacing-2;
    display: block;
  }
}

.load-more-comments {
  display: flex;
  justify-content: center;
  margin-top: $spacing-4;
}

.load-more-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: $primary-color;
  font-size: $text-sm;

  &::after {
    display: none;
  }
}

.load-text {
  margin-right: $spacing-1;
}

.view {
  background: $white;
  padding: 20rpx;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;

  .textarea {
    height: 200rpx;
    width: 100%;
    border: 1px solid #f1f5f9;
    border-radius: 10rpx;
    padding: $spacing-page;
    box-sizing: border-box;
  }

  .btn-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 20rpx;

    .btn {
      margin: 0rpx;
      border: none;
      background: $success-color;

      &::after {
        display: none;
      }
    }
  }
}

.empty-state {
  padding: 100rpx;
  text-align: center;
  color: $gray-500;
}
</style>
