<template>
  <view class="like-page">
    <!-- 我的点赞/收藏区域 -->
    <view class="content-section">
      <view class="section-header">
        <!-- 页面标题（根据路由参数动态显示） -->
        <text class="section-title">{{ navigateTitle }}</text>
        <!-- 内容数量统计 -->
        <text class="section-subtitle">
          共 {{ likedArticles.length }} 个内容
        </text>
      </view>

      <!-- 内容列表 -->
      <view class="article-list">
        <!-- 文章项循环渲染 -->
        <view v-for="item in likedArticles" :key="item.id" class="article-item">
          <view>
            <!-- 文章卡片（点击跳转详情） -->
            <view @click="viewPostDetail" class="article">
              <articleCardVue :item="item" />
            </view>
            <!-- 文章互动图标（点赞、评论、收藏） -->
            <articleIconVue
              @like="clickLike(item)"
              :acitveLike="item.like"
              :activeCollect="item.collect"
              @common="clickCommon"
              @collect="clickCollect(item)"
              :isColl="navigateTitle === '我的点赞' ? false : true"
              :data="{ like: item.likeNum, comment: item.comments }"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 我的点赞/收藏页面 myLikeandCollect.vue
 * 功能：
 * - 根据路由参数动态显示"我的点赞"或"我的收藏"页面
 * - 展示点赞/收藏的文章列表
 * - 支持取消点赞和取消收藏操作
 * - 点击文章可跳转到文章详情页
 * - 点击评论图标可跳转到文章详情页进行评论
 */

// 导入Vue相关
import { ref } from 'vue' // Vue响应式API
import { onLoad } from '@dcloudio/uni-app' // 页面生命周期钩子

// 导入数据
import { postData } from '@/MXJZdata/article.js' // 文章测试数据
import { likedArticles } from '@/MXJZdata/LikeandCollectData.js' // 点赞/收藏文章数据

// 导入组件
import articleCardVue from '@/components/articleCard/articleCard.vue' // 文章卡片组件
import articleIconVue from '@/components/articleIcon/articleIcon.vue' // 文章互动图标组件

// 导入状态管理和工具
import { articleStore } from '@/stores/article.js' // 文章状态管理
import { showToast } from '@/untils/index.js' // 提示框工具函数

// 页面标题（从路由参数获取）
const navigateTitle = ref('')
// 获取文章状态管理实例
const useArticleStore = articleStore()

/**
 * 跳转到文章详情页
 * 功能：
 * - 执行页面跳转
 * - 将文章数据存入状态管理供详情页使用
 */
const viewPostDetail = () => {
  // 执行页面跳转
  uni.navigateTo({
    url: '/subPages/articleDetail/articleDetail',
    success: () => {
      // 将测试数据存入 Pinia store，供详情页使用
      useArticleStore.setArticleDetail(postData.value)
    }
  })
}

/**
 * 处理点赞操作
 * @param {Object} item - 当前文章对象
 * 功能：
 * - 切换文章的点赞状态
 * - 显示操作结果提示
 */
const clickLike = (item) => {
  // 切换点赞状态
  item.like = !item.like
  // 显示操作结果提示
  showToast(item.like ? '点赞' : '取消点赞', 'success')
}

/**
 * 处理评论点击事件
 * 功能：
 * - 跳转到文章详情页进行评论
 */
const clickCommon = () => {
  // 调用查看详情方法进行跳转
  viewPostDetail()
}

/**
 * 处理收藏操作
 * @param {Object} item - 当前文章对象
 * 功能：
 * - 切换文章的收藏状态
 * - 显示操作结果提示
 */
const clickCollect = (item) => {
  // 切换收藏状态
  item.collect = !item.collect
  // 显示操作结果提示
  showToast(item.collect ? '收藏' : '取消收藏', 'success')
}

/**
 * 页面加载时的生命周期钩子
 * @param {Object} option - 路由参数
 * 功能：
 * - 获取路由参数中的页面标题
 * - 设置导航栏标题
 */
onLoad((option) => {
  // 设置页面标题
  navigateTitle.value = option.title
  // 设置导航栏标题
  uni.setNavigationBarTitle({ title: option.title })
})
</script>

<style lang="scss" scoped>
/**
 * 我的点赞/收藏页面样式定义
 * 样式结构：
 * - 页面主容器样式：整体布局和背景
 * - 内容区域样式：文章列表的容器样式
 * - 区域头部样式：标题和统计信息样式
 * - 文章列表样式：文章列表的整体布局
 * - 文章项样式：单篇文章的样式和交互效果
 */
.like-page {
  background-color: #f9fafb; // 页面背景色
  color: $gray-800; // 文字颜色
  min-height: 100vh; // 最小高度为视口高度
  padding: $spacing-page; // 页面内边距
}

.content-section {
  background-color: $white; // 内容区域背景色
  border-radius: 24rpx; // 圆角边框
  overflow: hidden; // 隐藏溢出内容
  padding: $spacing-page; // 内容区域内边距
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 阴影效果
}

.section-header {
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列
  padding-bottom: 30rpx; // 底部内边距
  border-bottom: 1px solid #f3f4f6; // 底部边框线

  .section-title {
    font-size: 30rpx; // 标题字体大小
    font-weight: 600; // 标题字重
    color: $gray-800; // 标题颜色
  }

  .section-subtitle {
    font-size: 24rpx; // 副标题字体大小
    color: $gray-500; // 副标题颜色
    margin-top: 8rpx; // 顶部外边距
  }
}

.article-list {
  // 文章项样式
  .article-item {
    padding: 30rpx 0; // 上下内边距
    border-bottom: 1px solid #f3f4f6; // 底部边框线
    transition: background-color 0.3s ease; // 背景色过渡效果

    &:last-child {
      border-bottom: none; // 最后一项无边框线
    }

    // 悬停效果（小程序端不支持）
    &:hover {
      background-color: $gray-100; // 悬停背景色
    }
  }
}
</style>
