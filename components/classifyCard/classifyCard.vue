<!--
 * 分类选择组件 classifyCard.vue
 * 功能：用于在记账页面中选择支出或收入的分类
 * 
 * 主要功能模块：
 * 1. 根据记账类型（支出/收入）动态加载不同的分类列表
 * 2. 以网格形式展示分类项（包含图标和标题）
 * 3. 支持分类项的选择和选中状态显示
 * 4. 向父组件发送选中的分类信息
 -->

<template>
  <!-- 分类选择区域 -->
  <view class="category-section">
    <!-- 分类网格布局 -->
    <view class="category-grid">
      <!-- 分类项（循环渲染） -->
      <view
        v-for="item in dataList"
        :key="item.id"
        class="category-item"
        :class="{ active: props.id === item.id }"
        @click="selectCategory(item)"
      >
        <view class="icon-box">
          <view class="icon-wrapper">
            <!-- 图标容器，选中时添加放大效果 -->
            <view class="sace" :class="{ saceActive: props.id === item.id }">
              <!-- 图标组件，显示分类图标 -->
              <iconsVue
                iconType="expense"
                :iconBack="item.color"
                :iconUcode="item.icon"
                :iconColor="item.iconColor"
              />
            </view>
          </view>
          <!-- 分类标题 -->
          <view class="text">{{ item.title }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 分类选择组件脚本
 * 定义了组件的属性、数据、监听和方法
 */

// 导入分类数据
import {
  expenseCategoryData, // 支出分类数据
  incomeCategoryData // 收入分类数据
} from '@/MXJZdata/amountCategoryData.js'

import iconsVue from '@/components/icons/icons.vue' // 导入图标组件
import { ref, defineProps, watch, defineEmits } from 'vue'

// 响应式数据：分类列表（初始加载支出分类）
const dataList = ref([...expenseCategoryData])

// 定义组件事件
const emits = defineEmits(['newItem']) // 向父组件发送选中的分类项

// 定义组件属性
const props = defineProps({
  type: {
    tyep: String, // 类型：'expense'（支出）或 'income'（收入）
    required: true // 必填属性
  },
  id: {
    type: Number, // 当前选中的分类ID
    required: true // 必填属性
  }
})

// 监听分类类型变化，动态切换分类列表
watch(
  () => props.type,
  (val) => {
    if (val === 'expense') {
      dataList.value = [...expenseCategoryData] // 切换为支出分类
    } else {
      dataList.value = [...incomeCategoryData] // 切换为收入分类
    }
  },
  { deep: true, immediate: true } // 深度监听，立即执行
)

/**
 * 选择分类项的方法
 * @param {Object} item - 选中的分类对象
 */
const selectCategory = (item) => {
  emits('newItem', item) // 向父组件发送选中的分类项
}
</script>

<style lang="scss" scoped>
// 分类选择样式定义
.category-section {
  margin-bottom: $spacing-6; // 底部外边距
}

// 分类标题样式（虽然在当前模板中未使用，但保留以备扩展）
.section-title {
  color: $gray-500; // 文本颜色
  margin-bottom: $spacing-3; // 底部外边距
  display: block; // 块级元素
}

// 分类网格布局
.category-grid {
  display: grid; // 使用grid布局
  grid-template-columns: repeat(4, 1fr); // 4列等宽
  row-gap: 50rpx; // 行间距
  column-gap: 10rpx; // 列间距
}

// 分类项样式
.category-item {
  display: flex; // 使用flex布局
  flex-direction: column; // 垂直排列
  align-items: center; // 水平居中
  transition: all 0.3s ease; // 过渡动画

  // 图标和文本容器
  .icon-box {
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直排列
    justify-content: center; // 垂直居中
    align-items: center; // 水平居中

    // 图标外层容器
    .sace {
      margin-bottom: 20rpx; // 底部外边距
      transition: transform 0.3s linear; // 缩放动画

      // 点击时的缩放效果
      &:active {
        transform: scale(1.3);
      }

      // 选中时的缩放效果
      &.saceActive {
        transform: scale(1.3);
      }
    }
  }

  // 分类标题样式
  .text {
    color: $gray-700; // 文本颜色
  }
}
</style>
