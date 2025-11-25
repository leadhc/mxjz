<template>
  <view>
    <view class="create-post-page">
      <!-- 标题输入区域 -->
      <view class="header">
        <view class="title-container">
          <searchVue
            :isInput="true"
            placeholder="输入文章标题"
            v-model="titleValue"
          />
        </view>
      </view>

      <!-- 富文本编辑器区域 -->
      <view class="editor">
        <!-- 工具栏 -->
        <view class="tools">
          <view class="icon-box">
            <!-- 插入图片 -->
            <view @click="handleInsertImage">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e64b"
                iconSize="30"
              />
            </view>

            <!-- 加粗 -->
            <view @click="handleBold">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e61e"
                iconSize="22"
              />
            </view>

            <!-- 下划线 -->
            <view @click="handleUnderline">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e683"
                iconSize="29"
              />
            </view>

            <!-- 行高选择 -->
            <view class="line-height" @click="handleToggleLineHeight">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e60c"
                iconSize="21"
              />
              <scroll-view
                class="text-lint"
                scroll-y="true"
                show-scrollbar="{{false}}"
                enhanced
                v-if="lineHeightShow"
              >
                <view class="text" @click.stop="handleSetLineHeight(1)">1</view>
                <view class="text" @click.stop="handleSetLineHeight(1.5)"
                  >1.5</view
                >
                <view class="text" @click.stop="handleSetLineHeight(2)">2</view>
                <view class="text" @click.stop="handleSetLineHeight(2.5)"
                  >2.5</view
                >
                <view class="text" @click.stop="handleSetLineHeight(3)">3</view>
              </scroll-view>
            </view>

            <!-- 有序列表 -->
            <view @click="handleOrderedList">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e628"
                iconSize="17"
              />
            </view>

            <!-- 无序列表 -->
            <view @click="handleBulletList">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e62a"
                iconSize="16"
              />
            </view>

            <!-- 标题级别选择 -->
            <view class="header-box" @click="handleToggleHeader">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e6a6"
                iconSize="16"
              />
              <scroll-view
                class="header-text"
                v-if="headerShow"
                scroll-y="true"
                show-scrollbar="{{false}}"
                enhanced
              >
                <view class="text" @click.stop="handleSetHeader('H1')">H1</view>
                <view class="text" @click.stop="handleSetHeader('H2')">H2</view>
                <view class="text" @click.stop="handleSetHeader('H3')">H3</view>
                <view class="text" @click.stop="handleSetHeader('H4')">H4</view>
                <view class="text" @click.stop="handleSetHeader('H5')">H5</view>
              </scroll-view>
            </view>

            <!-- 撤销 -->
            <view @click="handleUndo">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e709"
                iconSize="20"
              />
            </view>

            <!-- 重做（恢复） -->
            <view @click="handleRedo">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e7a9"
                iconSize="22"
              />
            </view>

            <!-- 清空内容 -->
            <view @click="handleClear">
              <iconsVue
                iconType="'"
                backHeight="10"
                iconUcode="e615"
                iconSize="22"
              />
            </view>
          </view>
        </view>

        <!-- 编辑器本体（不再用额外 view 包裹） -->
        <editor
          class="editorbox"
          placeholder="输入文章内容"
          show-img-size
          show-img-resize
          @ready="handleEditorReady"
          @input="handleEditorInput"
          @statuschange="handleEditorStatusChange"
        />

        <!-- 默认插槽 -->
        <view class="" v-if="$slots.default">
          <slot></slot>
        </view>

        <!-- 操作按钮 -->
        <view class="btn-box">
          <button class="btn" @click="handlePreview">预览文章</button>
          <button class="btn" @click.stop="handlePublish1">发布文章</button>
        </view>
      </view>
    </view>

    <!-- 预览弹层 -->

    <page-container :show="isPreviewVisible" @afterleave="handlePreviewLeave">
      <scroll-view
        class="page-body"
        scroll="true"
        scroll-y="true"
        show-scrollbar="{{false}}"
        enhanced
      >
        <view class="title">
          {{ titleValue }}
        </view>
        <rich-text :nodes="editorHtmlContent.html" />
      </scroll-view>
    </page-container>
  </view>
</template>

<script setup>
import { ref, getCurrentInstance, defineEmits } from 'vue'
import searchVue from '@/components/search/search.vue'
import iconsVue from '@/components/icons/icons.vue'
import { showToast } from '@/untils/index.js'

// ====== 响应式状态 ======
const instance = getCurrentInstance()
const context = ref(null) // 编辑器上下文
const imgArray = ref([]) // 已插入的图片列表（可选，用于后续管理）
const lineHeightShow = ref(false) // 行高下拉菜单显隐
const headerShow = ref(false) // 标题级别下拉菜单显隐
const editorHtmlContent = ref('') // 编辑器生成的 HTML 内容
const isPreviewVisible = ref(false) // 预览弹层是否显示
const titleValue = ref('') //文章标题

const emits = defineEmits(['push'])

// ====== 编辑器操作事件 ======

/**
 * 获取编辑器实例
 */
const handleEditorReady = () => {
  uni
    .createSelectorQuery()
    .in(instance)
    .select('.editorbox')
    .context((res) => {
      if (res.context) {
        context.value = res.context
        // 可选：初始化默认格式（此处保留但可删除）
        context.value.format('header', 'H1')
        context.value?.format('lineHeight', '$1.5rem')
      }
    })
    .exec()
}

/**
 * 编辑器内容变化时同步 HTML
 */
const handleEditorInput = (e) => {
  editorHtmlContent.value = e.detail
}

/**
 * 编辑器状态变化（如选区改变）
 */
const handleEditorStatusChange = () => {
  // 当前未使用，保留监听
}

// ====== 工具栏功能事件 ======

/**
 * 插入图片
 */
const handleInsertImage = () => {
  uni.chooseMedia({
    success: (res) => {
      insertImg(res.tempFiles)
    },
    fail: () => {
      console.log('图片选择失败')
    }
  })
}

/**
 * 批量插入图片到编辑器
 */
const insertImg = (files) => {
  files.forEach((file) => {
    imgArray.value.push(file)
    context.value?.insertImage({
      src: file.tempFilePath,
      width: '95%',
      success: () => {
        console.log('图片插入成功')
      }
    })
  })
}

/**
 * 加粗文本
 */
const handleBold = () => {
  context.value?.format('bold')
}

/**
 * 添加下划线
 */
const handleUnderline = () => {
  context.value?.format('underline')
}

/**
 * 切换行高下拉菜单
 */
const handleToggleLineHeight = () => {
  lineHeightShow.value = !lineHeightShow.value
  headerShow.value = false
}

/**
 * 设置行高
 */
const handleSetLineHeight = (value) => {
  console.log('设置行高:', value)
  context.value?.format('lineHeight', `${value}rem`)
  // 延迟关闭,避免事件穿透
  setTimeout(() => {
    lineHeightShow.value = false
  }, 100)
}

/**
 * 有序列表
 */
const handleOrderedList = () => {
  context.value?.format('list', 'ordered')
}

/**
 * 无序列表
 */
const handleBulletList = () => {
  context.value?.format('list', 'bullet')
}

/**
 * 切换标题级别下拉菜单
 */
const handleToggleHeader = () => {
  headerShow.value = !headerShow.value
  lineHeightShow.value = false
}

/**
 * 设置标题级别（H1-H5）
 */
const handleSetHeader = (level) => {
  context.value?.format('header', level)

  setTimeout(() => {
    headerShow.value = false
  }, 100)
}

/**
 * 撤销操作
 */
const handleUndo = () => {
  context.value?.undo({
    fail: () => showToast('撤销失败', 'error')
  })
}

/**
 * 重做（恢复）操作
 */
const handleRedo = () => {
  context.value?.redo({
    fail: () => showToast('恢复失败', 'error')
  })
}

/**
 * 清空编辑器内容
 */
const handleClear = () => {
  context.value?.clear({
    success: () => showToast('清除成功')
  })
}

// ====== 预览相关事件 ======

/**
 * 打开预览弹层
 */
const handlePreview = () => {
  isPreviewVisible.value = true
}

/**
 * 预览弹层关闭后回调
 */
const handlePreviewLeave = () => {
  isPreviewVisible.value = false
}

// 发布文章
const handlePublish1 = () => {
  console.log('发布按钮被点击了  handlePublish')
  if (!titleValue.value) {
    showToast('输入文章标题')
    return
  }

  if (!editorHtmlContent.value) {
    showToast('输入内容')
    return
  }

  emits('push', { title: titleValue.value, content: editorHtmlContent.value })
}
</script>

<style lang="scss">
/* 页面根容器 */
.create-post-page {
  background-color: #f5f5f5;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* ====== 标题区域 ====== */
.header {
  width: 100%;
  padding: $spacing-page $spacing-page 0rpx $spacing-page;
  box-sizing: border-box;
}

.title-container {
  margin-bottom: 40rpx;
  height: 70rpx;
  background-color: white;
  border: 1rpx solid #ddd;
  padding: 0rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* ====== 工具栏 ====== */
.tools {
  width: 100%;
  padding: 0rpx $spacing-page;
  box-sizing: border-box;

  .icon-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20rpx;
    row-gap: 20rpx;
    column-gap: 30rpx;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }
}

/* 行高下拉菜单 */
.line-height {
  position: relative;

  .text-lint {
    max-height: 200rpx;
    width: 100rpx;
    padding: 10rpx;
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    background: white;
    left: 60rpx;
    bottom: 0rpx;
    z-index: 999;
    border-radius: 10rpx;
    box-sizing: border-box;
    overflow: hidden;

    .text {
      text-align: center;
      padding: 20rpx 0rpx;
    }
  }
}

/* 标题级别下拉菜单 */
.header-box {
  position: relative;

  .header-text {
    max-height: 200rpx;
    width: 100rpx;
    padding: 10rpx;
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    background: white;
    left: 40rpx;
    bottom: 0rpx;
    z-index: 999;
    border-radius: 10rpx;
    box-sizing: border-box;
    overflow: hidden;
    .text {
      text-align: center;
      padding: 20rpx 0rpx;
    }
  }
}

/* ====== 编辑器主体 ====== */
.editorbox {
  padding: 0rpx $spacing-page $spacing-page;
  min-height: 900rpx;

  margin-bottom: 40rpx;
}

/* ====== 预览弹层内容 ====== */
.page-body {
  padding: $spacing-page;
  height: 100vh;
  background: white;
  width: 100%;
  box-sizing: border-box;

  .title {
    font-size: 2em;
    font-weight: bold;
    line-height: 1.5;
    margin: 0.67em 0;
  }
}

/* ====== 操作按钮 ====== */
.btn-box {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .btn {
    background: #007aff;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200rpx;
    color: white;
    font-size: 28rpx;

    &::after {
      display: none; // 移除 button 默认边框（uni-app 特有）
    }
  }
}
</style>
