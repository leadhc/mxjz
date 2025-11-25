<template>
  <!-- 发布文章页面主容器 -->
  <view class="create-post-page">
    <!-- 富文本编辑器区域：使用editorContext组件封装编辑器功能 -->
    <view class="">
      <!-- 富文本编辑器组件 -->
      <editorContextVue @push="handlePush">
        <template #default>
          <!-- 文章标签选择区域：用户可以为文章选择多个标签 -->
          <view class="tags-container">
            <view class="tags-grid">
              <!-- 标签项：循环渲染标签列表，支持点击选中/取消 -->
              <view
                v-for="(tag, index) in tags"
                :key="index"
                class="tag-item"
                :class="{ 'tag-selected': selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </view>
            </view>
          </view>
        </template>
      </editorContextVue>
    </view>
  </view>
</template>

<script setup>
/**
 * 发布文章页面 publishArticle.vue
 * 功能：
 * - 提供富文本编辑器用于撰写文章
 * - 支持为文章选择多个标签
 * - 文章发布功能（模拟）
 */
import { ref } from 'vue'
import editorContextVue from '@/components/editorContext/editorContext.vue' // 富文本编辑器组件
import { showToast } from '../../untils' // 提示框工具函数

// 文章标签数据
const tags = ref([
  '理财技巧',
  '省钱攻略',
  '投资心得',
  '债务管理',
  '创业经验',
  '其他'
])

// 用户选中的标签列表
const selectedTags = ref([])

/**
 * 切换标签选中状态
 * 功能：点击标签时，若已选中则取消，若未选中则添加到选中列表
 * @param {string} tag - 要切换的标签名称
 */
const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    // 如果标签已选中，则从选中列表中移除
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    // 如果标签未选中，则添加到选中列表
    selectedTags.value.push(tag)
  }
}

/**
 * 处理文章发布
 * 功能：整合选中的标签和编辑器内容，模拟发布文章操作
 * @param {Object} val - 编辑器返回的文章内容
 */
const handlePush = (val) => {
  // 整合标签和文章内容
  const publishVal = { ...selectedTags.value, ...val }
  console.log(val, 'val')
  console.log(publishVal, 'push')
  // 模拟发布成功提示
  showToast('模拟发布文章')
}
</script>

<style lang="scss">
/**
 * 发布文章页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景设置
 * - 标签选择样式：标签容器、标签网格和标签项样式
 */

// 页面基础样式
.create-post-page {
  background-color: #f5f5f5; // 页面背景色
  color: #333; // 页面文字颜色
  width: 100%; // 宽度占满视口
  min-height: 100vh; // 最小高度占满视口
  padding-bottom: 60rpx; // 底部内边距，避免内容被底部导航遮挡
  box-sizing: border-box; // 盒模型设置，确保内边距和边框计入总宽高
  overflow-x: hidden; // 隐藏水平滚动条
}

// 标签选择区域样式
.tags-container {
  padding: 20rpx; // 区域内边距
  margin-bottom: 40rpx; // 底部外边距

  // 标签标签样式（当前未使用）
  .tags-label {
    font-size: 28rpx; // 字体大小
    color: #666; // 文本颜色
    margin-bottom: 16rpx; // 底部外边距
  }

  // 标签网格布局
  .tags-grid {
    display: flex; // 弹性布局
    flex-wrap: wrap; // 自动换行
    gap: 16rpx; // 标签之间的间距

    // 标签项基础样式
    .tag-item {
      padding: 8rpx 16rpx; // 内边距
      border-radius: 20rpx; // 圆角
      background-color: #f0f0f0; // 背景色
      font-size: 24rpx; // 字体大小
      color: #333; // 文本颜色
      border: 1rpx solid #ddd; // 边框
    }

    // 标签选中状态样式
    .tag-selected {
      background-color: #ffffff; // 选中状态背景色
      border-color: #007aff; // 选中状态边框色
      color: #007aff; // 选中状态文本色
    }
  }
}
</style>
