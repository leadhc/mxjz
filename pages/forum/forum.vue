<template>
  <!-- 论坛页面 - 展示分类帖子列表，支持分类切换、搜索、发布帖子等功能 -->
  <view class="forum-page">
    <view class="forum-container">
      <!-- 搜索框区域 -->
      <view class="search-section">
        <view class="search-input-wrapper" @click="newSearchPage">
          <!-- 搜索组件，点击跳转到搜索页面 -->
          <searchVue
            style="width: 100%"
            :isInput="false"
            :value="searchKeyword"
            :isIcon="true"
            placeholder="搜索话题、帖子"
          />
        </view>
      </view>

      <!-- 分类标签区域 -->
      <view class="category-tabs">
        <scroll-view
          class="tab-scroll"
          scroll-x="true"
          :scroll-left="tabsScroll + 'px'"
          show-scrollbar="false"
          scroll-with-animation="true"
          enhanced
        >
          <view class="tab-container">
            <!-- 分类标签按钮列表 -->
            <button
              v-for="(tab, index) in categoryTabs"
              :key="tab.id"
              class="tab-button"
              :class="{ active: activeTab === tab.id }"
              :id="tab.id"
              @click="switchTab({ id: tab.id, index: index })"
            >
              {{ tab.name }}
              <!-- 标签名称 -->
            </button>
          </view>
        </scroll-view>
      </view>

      <!-- 帖子列表区域（使用 swiper 懒加载 + 虚拟列表优化性能） -->
      <view class="posts-list">
        <swiper
          class="swiper"
          :current="currentSwiper"
          @change="swiperChange"
          @animationfinish="onAnimationFinish"
          :style="{ height: headerHeight + 'px' }"
        >
          <!-- 每个分类标签对应的滑块 -->
          <swiper-item
            class="swiper-item"
            v-for="(item, index) in categoryTabs"
            :key="item.id"
          >
            <!-- 骨架屏：只有 loading 且无数据时才显示 -->
            <view
              v-if="
                isLoadingTab[item.id] &&
                !(visiblePostsCache[item.id]?.length > 0)
              "
              class="skeleton-container"
            >
              <view v-for="n in 5" :key="n" class="skeleton-card">
                <view class="skeleton-avatar"></view>
                <!-- 骨架屏头像 -->
                <view class="skeleton-content">
                  <view class="skeleton-title"></view>
                  <!-- 骨架屏标题 -->
                  <view class="skeleton-excerpt"></view>
                  <!-- 骨架屏摘要 -->
                  <view class="skeleton-meta"></view>
                  <!-- 骨架屏元信息 -->
                </view>
              </view>
            </view>

            <!-- 懒加载优化：不渲染非当前和非相邻的滑块 -->
            <view
              v-else-if="!shouldRenderItem(index)"
              style="height: 100%"
            ></view>

            <!-- 正常渲染虚拟列表 -->
            <scroll-view
              v-else
              class="scroll-view"
              scroll-y
              :show-scrollbar="false"
              enhanced
              :refresher-enabled="true"
              :refresher-triggered="refresherTriggered"
              lower-threshold="500"
              @scrolltolower="scrollToView"
              @refresherpulling="pulling"
              @refresherrefresh="startFresh"
              @scroll="(e) => handleScroll(e, item.id)"
            >
              <!-- 虚拟列表容器，设置总高度 -->
              <view
                :style="{
                  height: (totalHeightCache[item.id] || 0) + 'px',
                  position: 'relative'
                }"
                class="itemHei"
              >
                <!-- 可视区域容器，通过 transform 实现滚动 -->
                <view
                  :style="{
                    transform: `translateY(${offsetYCache[item.id] || 0}px)`,
                    background: 'white'
                  }"
                  class="view-box"
                >
                  <!-- 帖子卡片列表 -->
                  <view
                    v-for="post in visiblePostsCache[item.id] || []"
                    :key="post.id"
                    class="post-card card"
                  >
                    <!-- 文章卡片组件，点击跳转到详情页 -->
                    <view @tap="viewPostDetail" class="article">
                      <articleCardVue :item="post"></articleCardVue>
                    </view>
                    <!-- 文章操作按钮组件 -->
                    <articleIconVue
                      @like="clickLike(post.liked)"
                      @common="clickCommon"
                      @collect="clickCollect"
                      :data="post"
                    ></articleIconVue>
                  </view>
                  <!-- 无数据状态提示 -->
                  <view
                    class="data-none"
                    v-if="visiblePostsCache[item.id].length === 0"
                  >
                    <iconsVue
                      iconType="'"
                      iconColor="#007aff"
                      iconSize="90"
                      iconUcode="e60a"
                    ></iconsVue>
                  </view>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 发布按钮 -->
    <button class="floating-button" @click="newPublishArticlPage">
      <view class="">
        <iconsVue
          iconType="'"
          iconUcode="e63a"
          iconBack="#dbeafe"
          iconColor="#3b82f6"
          iconSize="60"
        ></iconsVue>
      </view>
    </button>
  </view>
</template>

<script setup>
/**
 * 论坛页面组件 forum.vue
 * 功能说明：
 * - 展示分类帖子列表，支持分类切换
 * - 实现搜索功能入口
 * - 支持下拉刷新和触底加载更多
 * - 优化性能：使用虚拟列表和懒加载技术
 * - 提供发布帖子的快捷入口
 */

// 导入Vue响应式API和生命周期钩子
import { ref, onMounted, watch, computed } from 'vue'

// 导入自定义组件
import searchVue from '@/components/search/search.vue' // 搜索组件
import articleCardVue from '@/components/articleCard/articleCard.vue' // 文章卡片组件
import articleIconVue from '@/components/articleIcon/articleIcon.vue' // 文章操作图标组件
import iconsVue from '@/components/icons/icons.vue' // 通用图标组件

// 导入工具函数
import { getDomRect, showToast } from '@/untils/index.js' // DOM测量和提示工具

// 导入状态管理
import { articleStore } from '@/stores/article.js' // 文章状态管理
import { userStore } from '@/stores/user' // 用户状态管理

// 导入模拟数据
import { postData, basePosts } from '@/MXJZdata/article.js' // 文章相关数据

// 响应式数据定义
const searchKeyword = ref('') // 搜索关键词，用于过滤常见问题列表
const activeTab = ref('all') // 当前激活的分类标签ID
const posts = ref([]) // 所有帖子数据
const currentSwiper = ref(0) // 当前swiper滑块索引
const tabsScroll = ref(0) // 标签栏滚动位置
const tabsIndex = ref(0) // 当前标签索引
const reMoreList = ref(false) // 加载更多状态
const headerHeight = ref(0) // 内容区域高度
const articleHeight = ref(0) // 单篇文章卡片高度
const refresherTriggered = ref(false) // 下拉刷新状态

// 状态管理实例
const useArticleStore = articleStore() // 文章状态管理实例
const useUserStore = userStore() // 用户状态管理实例

// 每个分类标签的独立loading状态
const isLoadingTab = ref({})

/**
 * 分类标签列表数据
 * @type {Array<{id: string, name: string}>}
 */
const categoryTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'finance', name: '理财技巧' },
  { id: 'saving', name: '省钱攻略' },
  { id: 'investment', name: '投资心得' },
  { id: 'debt', name: '债务管理' },
  { id: 'entrepreneurship', name: '创业经验' }
])

// 初始化每个分类标签的loading状态
categoryTabs.value.forEach((tab) => {
  isLoadingTab.value[tab.id] = true
})

// 每个分类标签的滚动状态
const tabScrollState = ref({})

// 缓存计算结果
const visiblePostsCache = ref({}) // 可视区域帖子缓存
const totalHeightCache = ref({}) // 总高度缓存
const offsetYCache = ref({}) // 偏移量缓存

/**
 * 预计算应渲染的索引，仅渲染当前和相邻滑块
 * @returns {Array<number>} 需要渲染的索引数组
 */
const renderedIndices = computed(() => {
  const total = categoryTabs.value.length
  const cur = currentSwiper.value
  const indeces = [cur]
  if (cur > 0) indeces.push(cur - 1)
  if (cur < total - 1) indeces.push(cur + 1)
  return indeces
})

/**
 * 判断是否应该渲染指定索引的滑块
 * @param {number} index - 滑块索引
 * @returns {boolean} 是否应该渲染
 */
const shouldRenderItem = (index) => renderedIndices.value.includes(index)

/**
 * 初始化每个分类标签的滚动状态
 */
const initTabScrollState = () => {
  const initialState = { start: 0, end: 9 } // 初始显示前10条数据
  categoryTabs.value.forEach((tab) => {
    tabScrollState.value[tab.id] = { ...initialState }
    visiblePostsCache.value[tab.id] = []
    totalHeightCache.value[tab.id] = 0
    offsetYCache.value[tab.id] = 0
  })
}

/**
 * 根据分类ID过滤帖子数据
 * @param {string} tabId - 分类标签ID
 * @returns {Array} 过滤后的帖子数组
 */
const getFilteredPosts = (tabId) => {
  if (tabId === 'all') return posts.value
  return posts.value.filter((post) => post.category === tabId)
}

// 监听滚动状态变化，更新可视区域内容
watch(
  tabScrollState,
  (newVal) => {
    categoryTabs.value.forEach((tab) => {
      const tabId = tab.id
      const list = getFilteredPosts(tabId)
      const state = newVal[tabId] || { start: 0, end: 9 }
      const itemH = articleHeight.value || 280

      // 更新可视区域帖子、总高度和偏移量
      visiblePostsCache.value[tab.id] = list.slice(state.start, state.end + 1)
      totalHeightCache.value[tab.id] = list.length * itemH
      offsetYCache.value[tab.id] = state.start * itemH
    })
  },
  { deep: true, immediate: true }
)

// 滚动节流处理的定时器ID
let timerId = null

/**
 * 处理滚动事件，更新可视区域内容（使用节流优化性能）
 * @param {Object} e - 滚动事件对象
 * @param {string} tabId - 当前分类标签ID
 */
const handleScroll = (e, tabId) => {
  const tabIndex = categoryTabs.value.findIndex((t) => t.id === tabId)
  if (!shouldRenderItem(tabIndex)) return

  // 节流处理，避免频繁计算
  if (timerId !== null) return
  timerId = setTimeout(() => {
    timerId = null

    const scrollTop = e.detail.scrollTop // 当前滚动位置
    const containerHeight = headerHeight.value // 容器高度
    const itemHeight = articleHeight.value // 单篇文章高度

    const filteredList = getFilteredPosts(tabId) // 过滤后的帖子列表
    const totalItems = filteredList.length // 总帖子数
    if (totalItems === 0) return

    // 计算新的可视区域范围
    const newStart = Math.max(0, Math.floor(scrollTop / itemHeight)) // 新的起始索引
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 5 // 可视数量（额外多渲染5个）
    const newEnd = Math.min(totalItems - 1, newStart + visibleCount) // 新的结束索引

    // 更新滚动状态
    tabScrollState.value[tabId] = { start: newStart, end: newEnd }
  }, 16) // 约60fps的刷新率
}

/**
 * 切换分类标签
 * @param {Object} obj - 标签信息对象
 * @param {string} obj.id - 标签ID
 * @param {number} obj.index - 标签索引
 */
const switchTab = (obj) => {
  const { id, index } = obj
  // 显示loading状态
  isLoadingTab.value[id] = true
  setTimeout(() => {
    isLoadingTab.value[id] = false
  }, 200)

  // 更新激活状态和滑块索引
  activeTab.value = id
  tabsIndex.value = index
  currentSwiper.value = index
}

/**
 * Swiper动画结束回调
 * @param {Object} e - 事件对象
 * @param {Object} e.detail - 事件详情
 * @param {number} e.detail.current - 当前滑块索引
 */
const onAnimationFinish = (e) => {
  const newIndex = e.detail.current
  const tabId = categoryTabs.value[newIndex].id

  // 更新标签和滑块状态
  tabsIndex.value = newIndex
  activeTab.value = tabId
  currentSwiper.value = newIndex
}

/**
 * Swiper滑动中回调
 * @param {Object} e - 事件对象
 * @param {Object} e.detail - 事件详情
 * @param {number} e.detail.current - 当前滑块索引
 */
const swiperChange = (e) => {
  const newIndex = e.detail.current
  const tabId = categoryTabs.value[newIndex].id

  // 更新标签和滑块状态
  activeTab.value = tabId
  tabsIndex.value = newIndex
}

/**
 * 开始下拉刷新
 */
const startFresh = () => {
  console.log('下拉刷新')
  refresherTriggered.value = true
  // 模拟刷新完成
  setTimeout(() => {
    refresherTriggered.value = false
  }, 1000)
}

/**
 * 下拉刷新中回调
 */
const pulling = () => console.log('下拉中...')

/**
 * 处理点赞操作
 * @param {boolean} isLiked - 是否已点赞
 */
const clickLike = (isLiked) => {
  if (!useUserStore.isLogin()) return // 未登录时不允许操作
  showToast('模拟点赞')
}

/**
 * 处理评论操作
 */
const clickCommon = () => {
  if (!useUserStore.isLogin()) return // 未登录时不允许操作
  // 跳转到文章详情页
  uni.navigateTo({
    url: '/subPages/articleDetail/articleDetail',
    success: () => {
      useArticleStore.setArticleDetail(postData.value)
    }
  })
}

/**
 * 处理收藏操作
 */
const clickCollect = () => {
  if (!useUserStore.isLogin()) return // 未登录时不允许操作
  showToast('模拟收藏')
}

/**
 * 跳转到文章详情页
 */
const viewPostDetail = () => {
  uni.navigateTo({
    url: '/subPages/articleDetail/articleDetail',
    success: () => {
      useArticleStore.setArticleDetail(postData.value)
    }
  })
}

/**
 * 跳转到发布文章页面
 */
const newPublishArticlPage = () => {
  if (!useUserStore.isLogin()) return // 未登录时不允许操作
  uni.navigateTo({ url: '/subPages/publishArticle/publishArticle' })
}

/**
 * 触底加载更多数据
 */
const scrollToView = () => {
  showToast('模拟加载更多')
  reMoreList.value = true
  // 模拟加载完成
  setTimeout(() => {
    reMoreList.value = false
  }, 1000)
}

/**
 * 跳转到搜索页面
 */
const newSearchPage = () => {
  if (!useUserStore.isLogin()) return // 未登录时不允许操作
  uni.navigateTo({ url: '/subPages/searchArticle/searchArticle' })
}

/**
 * 页面加载时的初始化操作
 */
onMounted(() => {
  // 初始化帖子数据
  posts.value = [...basePosts.value]

  // 初始化每个分类标签的滚动状态
  initTabScrollState()

  // 所有标签初始化完成，关闭loading
  categoryTabs.value.forEach((tab) => {
    isLoadingTab.value[tab.id] = false
  })

  // 延迟计算DOM元素高度，确保渲染完成
  setTimeout(() => {
    getDomRect(['.post-card', '.search-section', '.category-tabs'])
      .then((res) => {
        // 计算单篇文章卡片高度
        articleHeight.value = res['.post-card']?.height || 280
        // 获取窗口信息
        const winInfo = wx.getWindowInfo()
        const screenHeight = winInfo.safeArea?.height || winInfo.windowHeight
        // 计算已使用高度
        const usedHeight =
          (res['.search-section']?.height || 0) +
          (res['.category-tabs']?.height || 0) +
          36
        // 计算内容区域高度
        headerHeight.value = screenHeight - usedHeight - 85
      })
      .catch((err) => {
        console.error('高度计算失败:', err)
        // 失败时使用默认值
        articleHeight.value = 280
        headerHeight.value = 600
      })
  }, 100)
})

// 监听激活标签变化，自动滚动标签栏
watch(
  () => activeTab.value,
  (val) => {
    getDomRect(`#${val}`).then((res) => {
      tabsScroll.value = tabsIndex.value * res.width
    })
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
/**
 * 论坛页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景
 * - 搜索区域样式：搜索框容器和输入框样式
 * - 分类标签样式：标签栏、滚动容器和标签按钮样式
 * - 帖子列表样式：帖子卡片、骨架屏和虚拟列表容器样式
 * - 发布按钮样式：悬浮发布按钮的样式和动画
 */

// 页面基础样式
.forum-page {
  background-color: $gray-50; // 页面背景色，使用浅灰色背景增强可读性
  color: $gray-800; // 页面文字颜色，使用深灰色确保可读性
  height: 100vh; // 高度占满整个视口
  overflow: hidden; // 隐藏溢出内容
  position: relative; // 相对定位，用于悬浮按钮定位
}

// 页面容器样式
.forum-container {
  padding: $spacing-page; // 页面内边距，使用统一变量管理
  box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
}

// 搜索区域样式
.search-section {
  margin-bottom: $spacing-3; // 下外边距，与分类标签区域分隔
}

.search-input-wrapper {
  height: 82rpx; // 搜索框高度
  width: 100%; // 宽度100%，占满容器宽度
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
  border-radius: 16rpx; // 圆角，提升视觉柔和度
  padding: 10rpx 15rpx; // 内边距，确保内容不会紧贴边缘
  border: 2rpx solid $gray-200; // 边框，使用浅灰色
  box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
}

// 分类标签区域样式
.category-tabs {
  margin-bottom: $spacing-6; // 下外边距，与帖子列表区域分隔
  position: sticky; // 粘性定位，滚动时固定在顶部
  top: 0; // 距离顶部0像素
  z-index: 999; // 层级较高，确保在其他元素上方
  background-color: $gray-50; // 背景色，与页面背景一致
}

.tab-scroll {
  white-space: nowrap; // 不换行，确保标签横向排列
  width: 100%; // 宽度100%，占满容器宽度

  // 隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tab-container {
  display: inline-flex; // 行内弹性布局，适应内容宽度
  gap: $spacing-3; // 标签间距，使用统一变量管理
  padding: $spacing-1 0; // 上下内边距，确保标签有足够空间
}

.tab-button {
  padding: $spacing-1 $spacing-1; // 按钮内边距，控制按钮大小
  min-width: 150rpx; // 最小宽度，确保标签文本不会被截断
  border: none; // 无边框，使用自定义样式
  border-radius: 50rpx; // 圆角，提升视觉柔和度
  font-size: 22rpx; // 字体大小，使用较小字号
  background-color: $gray-100; // 背景色，使用浅灰色
  color: $gray-700; // 文字颜色，使用中灰色
  white-space: nowrap; // 不换行，确保标签文本完整显示
  transition: all 0.3s ease; // 过渡动画，提升交互体验
  display: flex; // 弹性布局
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中

  // 激活状态样式
  &.active {
    background-color: $primary-color; // 背景色，使用主题色
    color: $white; // 文字颜色，使用白色确保可读性
  }

  // 隐藏默认按钮样式
  &::after {
    border: none;
  }
}

// 帖子列表区域样式
.posts-list {
  flex: 1; // 弹性布局，占据剩余空间
  overflow: hidden; // 隐藏溢出内容
}

.swiper {
  width: 100%; // 宽度100%，占满容器宽度
  background-color: white; // 背景色，使用白色突出内容
}

.swiper-item {
  height: 100%; // 高度100%，占满swiper高度
  box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度

  .view-box {
    padding-bottom: 30px; // 下内边距，确保最后一个帖子有足够空间
    box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
  }

  .scroll-view {
    height: 100%; // 高度100%，占满swiper-item高度
    box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
  }
}

// 帖子卡片样式
.post-card {
  box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
  margin-bottom: $spacing-4; // 下外边距，与其他帖子分隔
  padding: $spacing-4; // 内边距，确保内容不会紧贴边缘
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列
}

.card {
  background-color: $white; // 卡片背景色，使用白色突出内容
  border-radius: 24rpx; // 圆角，提升视觉柔和度
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 阴影，增加层次感
  transition: all 0.3s ease; // 过渡动画，提升交互体验

  // 悬停效果
  &:hover {
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1); // 增强阴影
    transform: translateY(-2rpx); // 轻微上浮，提升层次感
  }
}

// 骨架屏样式
.skeleton-container {
  padding: $spacing-page; // 内边距，与正常内容保持一致
  padding-top: 0; // 无上内边距，与分类标签区域紧贴
  box-sizing: border-box; // 盒模型，确保内边距不会增加元素宽度
  height: 100%; // 高度100%，占满容器高度
  overflow: hidden; // 隐藏溢出内容
}

.skeleton-card {
  display: flex; // 弹性布局
  margin-bottom: $spacing-4; // 下外边距，与其他骨架屏卡片分隔
  padding: $spacing-4; // 内边距，与正常帖子卡片保持一致
  background-color: $white; // 背景色，使用白色
  border-radius: 24rpx; // 圆角，与正常帖子卡片保持一致
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05); // 轻微阴影
  animation: skeleton-loading 1.5s infinite ease-in-out; // 加载动画
}

.skeleton-avatar {
  width: 64rpx; // 头像宽度
  height: 64rpx; // 头像高度
  border-radius: 50%; // 圆形头像
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  ); // 渐变背景
  margin-right: $spacing-3; // 右外边距，与内容区域分隔
  flex-shrink: 0; // 不收缩，保持固定大小
}

.skeleton-content {
  flex: 1; // 弹性布局，占据剩余空间
}

.skeleton-title {
  height: 36rpx; // 标题高度
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  ); // 渐变背景
  border-radius: 12rpx; // 圆角
  margin-bottom: $spacing-2; // 下外边距，与摘要区域分隔
  width: 80%; // 宽度80%，模拟标题长度
}

.skeleton-excerpt {
  height: 32rpx; // 摘要高度
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  ); // 渐变背景
  border-radius: 8rpx; // 圆角
  margin-bottom: $spacing-2; // 下外边距，与元信息区域分隔
  width: 100%; // 宽度100%，模拟摘要长度
}

.skeleton-meta {
  height: 28rpx; // 元信息高度
  width: 40%; // 宽度40%，模拟元信息长度
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  ); // 渐变背景
  border-radius: 8rpx; // 圆角
}

// 骨架屏加载动画
@keyframes skeleton-loading {
  0% {
    background-position: -200% 0; // 初始位置
  }
  100% {
    background-position: 200% 0; // 结束位置
  }
}

// 发布按钮样式
.floating-button {
  background: transparent; // 透明背景
  position: fixed; // 固定定位，悬浮在页面右下角
  bottom: 120rpx; // 距离底部120rpx
  right: 40rpx; // 距离右侧40rpx
  width: 112rpx; // 按钮宽度
  height: 112rpx; // 按钮高度
  border-radius: 50%; // 圆形按钮
  border: none; // 无边框
  padding: 0; // 无内边距
  margin: 0; // 无外边距
  display: flex; // 弹性布局
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中
  font-size: 100rpx; // 字体大小
  transition: all 0.3s ease; // 过渡动画，提升交互体验
  z-index: 50; // 层级较高，确保在其他元素上方

  // 隐藏默认按钮样式
  &::after {
    display: none;
  }

  // 悬停效果
  &:hover {
    transform: scale(1.1); // 放大1.1倍，提供反馈
  }
}
</style>
