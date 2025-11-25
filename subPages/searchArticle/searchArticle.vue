<template>
  <!-- 搜索文章页面主容器 -->
  <view class="search-page">
    <!-- 搜索框区域：包含搜索输入组件和清空按钮 -->
    <view class="search-container">
      <!-- 搜索栏：根据聚焦状态动态改变边框颜色 -->
      <view class="search-bar" :style="{ borderColor: inputFocusStyle }">
        <!-- 自定义搜索组件 -->
        <searchVue
          @lfocus="parentFocus"
          @lblur="parentBlur"
          @lconfirm="parentConfirm"
          v-model="inputModel"
          :isInput="true"
          size="32"
          placeholder="搜索话题、帖子"
        >
          <template #default>
            <!-- 清空输入按钮：仅当输入框有内容时显示 -->
            <view @click="clearInput">
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
    </view>

    <!-- 热门搜索区域：显示当前热门的搜索标签 -->
    <view class="section">
      <view class="section-header">
        <view><text>热门搜索</text></view>
      </view>
      <!-- 热门标签列表 -->
      <view class="hot-tags">
        <!-- 热门标签项：点击可直接搜索 -->
        <view
          v-for="(tag, index) in hotTags"
          :key="index"
          class="tag-item"
          @click="search(tag)"
        >
          {{ tag }}
        </view>
      </view>
    </view>

    <!-- 最近搜索区域：显示用户最近的搜索记录 -->
    <view class="section">
      <view class="section-header">
        <view class="history-search">
          <view class="text">最近搜索</view>
          <!-- 清空全部历史记录按钮 -->
          <view class="icon" @click="clearHistory">
            <iconsVUe
              iconType="''"
              iconUcode="e615"
              iconColor="#007aff"
              iconSize="20"
              backHeight="20"
            ></iconsVUe>
          </view>
        </view>
      </view>
      <!-- 最近搜索记录列表 -->
      <view class="recent-list">
        <!-- 最近搜索项 -->
        <view
          v-for="(item, index) in recentSearches"
          :key="index"
          class="recent-item"
        >
          <view class="text-box">
            <!-- 搜索记录文本：点击可重新搜索 -->
            <view class="text" @click="search(item)">
              {{ item }}
            </view>
            <!-- 删除单条历史记录按钮 -->
            <view @click="clearHistoryItem(item)">
              <iconsVUe
                iconType="''"
                iconUcode="e615"
                iconColor="#007aff"
                iconSize="20"
                backHeight="20"
              ></iconsVUe>
            </view>
          </view>
        </view>
      </view>
      <!-- 无历史记录时显示空状态图标 -->
      <view class="icon" v-if="recentSearches.length === 0">
        <iconsVUe
          iconType="''"
          iconUcode="e60a"
          iconColor="#007aff"
          iconSize="90"
        ></iconsVUe>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 搜索文章页面 searchArticle.vue
 * 功能：
 * - 提供搜索框用于输入搜索关键词
 * - 显示热门搜索标签
 * - 管理和显示最近搜索记录
 * - 支持清空搜索记录
 * - 跳转到搜索结果页面
 */
import { ref } from 'vue'
import searchVue from '@/components/search/search.vue' // 搜索输入组件
import iconsVUe from '@/components/icons/icons.vue' // 图标组件
import { historyStore } from '@/stores/history' // 历史搜索状态管理

// 搜索框边框颜色（用于聚焦/失焦状态切换）
const inputFocusStyle = ref('#e5e7eb')

// 搜索输入框的双向绑定值
const inputModel = ref('')

// 获取 Pinia 历史搜索 store 实例
const useHistoryStore = historyStore()

// 最近搜索记录：直接从 store 中读取初始值（注意：此处为浅层响应式绑定）
const recentSearches = ref(useHistoryStore.historySearch)

// 热门搜索标签列表
const hotTags = ref(['理财技巧', '省钱攻略', '投资心得', '债务管理'])

/**
 * 搜索框获得焦点事件处理
 * 功能：当搜索框获得焦点时，边框变为蓝色，提升用户体验
 */
const parentFocus = () => {
  inputFocusStyle.value = '#3b82f6'
}

/**
 * 搜索框失去焦点事件处理
 * 功能：当搜索框失去焦点时，边框恢复默认灰色
 */
const parentBlur = () => {
  inputFocusStyle.value = '#e5e7eb'
}

/**
 * 清空输入框内容
 * 功能：点击清空按钮时，清除搜索输入框中的内容
 */
const clearInput = () => {
  inputModel.value = ''
}

/**
 * 用户确认搜索事件处理
 * 功能：用户按下回车键或点击搜索按钮时触发
 * - 保存搜索记录
 * - 跳转到搜索结果页面
 * - 清空输入框
 */
const parentConfirm = () => {
  // 保存搜索记录到历史记录中
  saveHistorySearch(inputModel.value)
  // 跳转到搜索结果页
  search(inputModel.value)

  // 清空输入框
  inputModel.value = ''
}

/**
 * 清空全部最近搜索记录
 * 功能：点击清空按钮时，删除所有历史搜索记录
 */
const clearHistory = () => {
  recentSearches.value = []
  // 更新状态管理中的历史记录
  useHistoryStore.setHistorySearch(recentSearches.value)
}

/**
 * 删除单条历史记录
 * 功能：点击单条记录旁的删除按钮时，删除该条记录
 * @param {string} item - 要删除的搜索记录
 */
const clearHistoryItem = (item) => {
  // 过滤掉要删除的记录
  const newRecentSearches = recentSearches.value.filter(
    (items) => items !== item
  )
  // 更新本地状态
  recentSearches.value = newRecentSearches
  // 更新状态管理中的历史记录
  useHistoryStore.setHistorySearch(recentSearches.value)
}

/**
 * 执行搜索并跳转到结果页
 * 功能：根据搜索关键词跳转到搜索结果页面
 * @param {string} item - 要搜索的关键词
 */
const search = (item) => {
  uni.navigateTo({
    url: `/subPages/searchResult/searchResult?value=${item}`,
    success: () => {
      // 保存搜索记录到历史记录中
      saveHistorySearch(item)
    }
  })
}

/**
 * 保存搜索记录到历史记录
 * 功能：
 * - 限制历史记录数量（最多8条）
 * - 如果记录已存在，则移到最前面
 * - 如果记录不存在，则添加到最前面
 * @param {string} item - 要保存的搜索记录
 */
function saveHistorySearch(item) {
  // 如果记录数量超过8条，删除最旧的记录
  if (recentSearches.value.length > 8) {
    recentSearches.value.pop()
  }

  // 如果当前输入值不在最近搜索中，则添加到开头
  if (!recentSearches.value.includes(item)) {
    recentSearches.value.unshift(item)
  } else {
    // 如果已存在，则遍历数组，找到后移到最前面
    recentSearches.value.forEach((items, index) => {
      if (items === item) {
        recentSearches.value.splice(index, 1)
        recentSearches.value.unshift(item)
      }
    })
  }

  // 同步更新状态管理中的历史记录
  useHistoryStore.setHistorySearch(recentSearches.value)
}
</script>

<style lang="scss">
/**
 * 搜索文章页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景设置
 * - 搜索框样式：搜索输入区域的样式
 * - 区域通用样式：热门搜索和最近搜索区域的通用样式
 * - 热门标签样式：热门搜索标签的样式和交互效果
 * - 最近搜索样式：最近搜索记录列表的样式
 */

// 页面基础样式
.search-page {
  background-color: #f8fafc; // 页面背景色
  color: #333; // 页面文字颜色
  min-height: 100vh; // 最小高度占满视口
  padding: 20rpx; // 页面内边距
  box-sizing: border-box; // 盒模型设置，确保内边距计入总宽高
}

// 搜索框容器样式
.search-container {
  margin-bottom: 10rpx; // 底部外边距

  // 搜索栏样式
  .search-bar {
    background-color: white; // 搜索栏背景色
    border: 2px solid #e5e7eb; // 搜索栏边框
    border-radius: 16rpx; // 搜索栏圆角
    padding: 0 20rpx; // 搜索栏内边距
    box-shadow: 0 2rpx 6rpx rgba(1, 0, 0, 0.1); // 搜索栏阴影
    position: relative; // 相对定位，用于子元素定位
    height: 72rpx; // 搜索栏高度

    // 输入框样式
    input {
      flex: 1; // 占满剩余空间
      font-size: 28rpx; // 字体大小
      line-height: 72rpx; // 行高，垂直居中
      border: none; // 无边框
      outline: none; // 无轮廓线
      background: transparent; // 透明背景
      color: #333; // 文字颜色
    }
  }
}

// 区域通用样式（热门搜索和最近搜索）
.section {
  padding: 20rpx; // 区域内边距
  margin-bottom: 10rpx; // 底部外边距
  background-color: white; // 区域背景色
  border-radius: 16rpx; // 区域圆角
  overflow: hidden; // 隐藏溢出内容
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 区域阴影

  // 区域头部样式
  .section-header {
    font-size: $text-xs; // 字体大小
    color: #333; // 文字颜色
    font-weight: 500; // 字体粗细

    // 历史搜索头部（包含标题和清空按钮）
    .history-search {
      display: flex; // 弹性布局
      justify-content: flex-start; // 水平对齐
      align-items: center; // 垂直对齐

      // 标题文本样式
      .text {
        flex: 1; // 占满剩余空间
      }
    }
  }
}

// 最近搜索列表样式
.recent-list {
  margin-top: 10rpx; // 顶部外边距

  // 最近搜索项样式
  .recent-item {
    padding: 16rpx 0; // 上下内边距
    border-bottom: 1rpx solid #eee; // 底部边框线
    font-size: $text-base; // 字体大小
    color: $gray-500; // 文字颜色

    // 最后一项无边框线
    &:last-child {
      border-bottom: none;
    }

    // 文本框容器样式
    .text-box {
      display: flex; // 弹性布局
      justify-content: flex-start; // 水平对齐
      align-items: center; // 垂直对齐

      // 搜索记录文本样式
      .text {
        flex: 1; // 占满剩余空间
      }
    }
  }
}

// 热门标签样式
.hot-tags {
  display: flex; // 弹性布局
  justify-content: space-between; // 标签均匀分布
  flex-wrap: wrap; // 自动换行
  padding-top: 20rpx; // 顶部内边距
  gap: 16rpx; // 标签间距

  // 热门标签项样式
  .tag-item {
    padding: 8rpx 20rpx; // 内边距
    border-radius: 20rpx; // 圆角
    background-color: #dbeafe; // 背景色
    font-size: 24rpx; // 字体大小
    color: $gray-800; // 文字颜色
    transition: all 0.3s ease; // 过渡动画效果

    // 鼠标悬停效果（小程序端不支持）
    &:hover {
      background-color: $primary-dark; // 悬停背景色
      color: $white; // 悬停文字颜色
    }
  }
}
</style>
