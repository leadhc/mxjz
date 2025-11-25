<template>
  <!-- 本月概览详情页面主容器 -->
  <view class="monthly-overview-page">
    <view class="overview-container">
      <!-- 统计卡片区域 -->
      <view class="stats-grid">
        <!-- 使用v-for渲染统计卡片列表 -->
        <view v-for="item in overviewDatas" :key="item.id">
          <!-- 月度统计卡片组件 -->
          <monthCardVue :data="item"></monthCardVue>
          <!-- 传递统计卡片数据 -->
        </view>
      </view>

      <!-- 支出分类占比区域 -->
      <view class="category-section card">
        <!-- 区域头部 -->
        <view class="section-header">
          <text class="section-title">支出分类占比</text>
          <!-- 区域标题 -->
        </view>
        <!-- 支出分类列表 -->
        <view
          class="category-list"
          v-for="category in expenseCategories"
          :key="category.id"
        >
          <view class="category-item">
            <!-- 交易账单组件，显示分类信息和进度条 -->
            <tranBillVue
              :data="category"
              :isProgress="true"
              :backColor="category.color"
            >
              <!-- 自定义图标插槽 -->
              <template v-slot:default>
                <iconsVue
                  :iconType="category.type"
                  :iconBack="category.color"
                  :iconUcode="category.icon"
                  :iconColor="category.color"
                />
              </template>
              <!-- 自定义百分比插槽 -->
              <template v-slot:note>
                <text>{{ category.percentage }}%</text>
                <!-- 显示支出占比百分比 -->
              </template>
            </tranBillVue>
          </view>
        </view>
      </view>

      <!-- 收入来源分析区域 -->
      <view class="income-section card">
        <!-- 区域头部 -->
        <view class="section-header">
          <text class="section-title">收入来源分析</text>
          <!-- 区域标题 -->
        </view>
        <!-- 收入来源列表 -->
        <view class="category-list">
          <view
            v-for="source in incomeSources"
            :key="source.id"
            class="category-item"
          >
            <!-- 交易账单组件，显示收入来源信息和进度条 -->
            <tranBillVue :data="source" :type="source.type">
              <!-- 自定义图标插槽 -->
              <template v-slot:default>
                <iconsVue
                  :iconType="source.type"
                  :iconBack="source.color"
                  :iconUcode="source.icon"
                  :iconColor="source.iconColor"
                ></iconsVue>
              </template>
              <!-- 自定义百分比插槽 -->
              <template v-slot:note> {{ source.percentage }}% </template>
              <!-- 显示收入占比百分比 -->
            </tranBillVue>
          </view>
        </view>
      </view>

      <!-- 月度对比区域 -->
      <view class="comparison-section card">
        <!-- 区域头部 -->
        <view class="section-header">
          <text class="section-title">月度对比</text>
          <!-- 区域标题 -->
          <!-- 对比选项按钮组 -->
          <view class="comparison-options">
            <!-- 上月同比按钮 -->
            <button
              class="option-button"
              :class="{ active: comparisonPeriod === 'month' }"
              @tap="comparisonPeriod = 'month'"
            >
              上月同比
            </button>
            <!-- 去年同月同比按钮 -->
            <button
              class="option-button"
              :class="{ active: comparisonPeriod === 'year' }"
              @tap="comparisonPeriod = 'year'"
            >
              去年同月同比
            </button>
          </view>
        </view>
        <!-- 对比内容列表 -->
        <view class="comparison-content">
          <!-- 总收入对比 -->
          <view class="comparison-item">
            <text class="comparison-label">总收入</text>
            <!-- 对比项标签 -->
            <view class="comparison-values">
              <!-- 当前收入金额，格式化显示 -->
              <text class="current-value">{{
                formatAmount(comparisonData.income.current)
              }}</text>
              <!-- 变化百分比 -->
              <view
                class="comparison-change"
                :class="getChangeClass(comparisonData.income.change)"
              >
                <!-- 变化箭头图标 -->
                <text
                  class="iconfont"
                  :class="getChangeIcon(comparisonData.income.change)"
                ></text>
                <!-- 变化百分比文本 -->
                <text class="change-text"
                  >{{ Math.abs(comparisonData.income.change) }}%</text
                >
              </view>
            </view>
          </view>
          <!-- 总支出对比 -->
          <view class="comparison-item">
            <text class="comparison-label">总支出</text>
            <!-- 对比项标签 -->
            <view class="comparison-values">
              <!-- 当前支出金额，格式化显示 -->
              <text class="current-value">{{
                formatAmount(comparisonData.expense.current)
              }}</text>
              <!-- 变化百分比 -->
              <view
                class="comparison-change"
                :class="getChangeClass(comparisonData.expense.change)"
              >
                <!-- 变化箭头图标 -->
                <text
                  class="iconfont"
                  :class="getChangeIcon(comparisonData.expense.change)"
                ></text>
                <!-- 变化百分比文本 -->
                <text class="change-text"
                  >{{ Math.abs(comparisonData.expense.change) }}%</text
                >
              </view>
            </view>
          </view>
          <!-- 结余对比 -->
          <view class="comparison-item">
            <text class="comparison-label">结余</text>
            <!-- 对比项标签 -->
            <view class="comparison-values">
              <!-- 当前结余金额，格式化显示 -->
              <text class="current-value">{{
                formatAmount(comparisonData.balance.current)
              }}</text>
              <!-- 变化百分比 -->
              <view
                class="comparison-change"
                :class="getChangeClass(comparisonData.balance.change)"
              >
                <text
                  class="iconfont"
                  :class="getChangeIcon(comparisonData.balance.change)"
                ></text>
                <!-- 变化百分比文本 -->
                <text class="change-text"
                  >{{ Math.abs(comparisonData.balance.change) }}%</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 本月概览页面组件
 * 功能说明：
 * - 展示用户月度收支统计、分类占比和月度对比数据
 * - 以卡片形式展示各类月度统计信息
 * - 展示支出分类的占比情况，包括进度条可视化
 * - 展示收入来源的分析数据，包括进度条可视化
 * - 提供与上月或去年同月的收支对比功能
 */

// 导入Vue相关API
import { ref } from 'vue' // Vue响应式API

// 导入组件
import tranBillVue from '@/components/tranBill/tranBill.vue' // 交易账单组件
import monthCardVue from '@/components/monthCard/monthCard.vue' // 月度统计卡片组件
import iconsVue from '@/components/icons/icons.vue' // 图标组件

// 导入工具函数
import { formatAmount } from '@/untils/index.js' // 金额格式化工具函数

// 导入月度概览数据
import {
  overviewDatas, // 统计卡片数据
  expenseCategories, // 支出分类数据
  incomeSources // 收入来源数据
} from '@/MXJZdata/monthOverData.js' // 月度概览数据

// ===== 响应式数据管理 =====

/**
 * 用于控制"月度对比"选项卡的当前选中状态
 * @type {string} 'month'表示上月同比，'year'表示去年同月同比
 */
const comparisonPeriod = ref('month')

/**
 * 月度对比数据（模拟数据）
 * @type {Object} 包含收入、支出和结余的当前值和变化百分比
 */
const comparisonData = ref({
  income: {
    current: 8650.0, // 当前收入金额
    change: 12.5 // 变化百分比（正值表示增长）
  },
  expense: {
    current: 2345.5, // 当前支出金额
    change: 5.2 // 变化百分比
  },
  balance: {
    current: 6304.5, // 当前结余金额
    change: 18.3 // 变化百分比
  }
})

// ===== 方法定义 =====

/**
 * 根据变化值返回对应的 CSS 类名（用于颜色区分）
 * @param {number} change - 变化百分比（可正可负）
 * @returns {string} 'positive' 或 'negative'，用于添加不同的CSS样式
 */
const getChangeClass = (change) => {
  return change >= 0 ? 'positive' : 'negative'
}

/**
 * 根据变化值返回对应的图标类名（箭头方向）
 * @param {number} change - 变化百分比（可正可负）
 * @returns {string} 'icon-arrow-up' 或 'icon-arrow-down'，用于显示不同的箭头图标
 */
const getChangeIcon = (change) => {
  return change >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'
}
</script>

<style lang="scss" scoped>
/**
 * 月度概览页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景设置
 * - 统计卡片区域：网格布局的卡片样式
 * - 分类分析区域：支出和收入分类的样式
 * - 月度对比区域：对比选项和数据展示的样式
 * - 通用卡片样式：统一的卡片视觉效果
 */

// 页面基础样式
.monthly-overview-page {
  background-color: $gray-50; // 页面背景色，使用浅灰色增强可读性
  color: $gray-800; // 页面文字颜色，使用深灰色提升可读性
  min-height: 100vh; // 最小高度占满整个视口，确保页面完整性
}

// 页面容器样式
.overview-container {
  padding: 20rpx; // 页面内边距，保持内容与屏幕边缘的合适距离
}

// 统计卡片网格样式
.stats-grid {
  display: grid; // 使用网格布局，便于响应式调整
  grid-template-columns: 1fr 1fr; // 两列等宽布局
  gap: $spacing-4; // 卡片间距，增加视觉层次感
  margin-bottom: $spacing-6; // 底部外边距，与下一个区域保持距离
}

// 通用卡片样式
.card {
  background-color: $white; // 卡片背景色为白色，突出内容
  border-radius: 24rpx; // 卡片圆角，柔和视觉效果
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 卡片阴影，增强层次感
  margin-bottom: $spacing-4; // 卡片间距，保持页面呼吸感
  padding: $spacing-4; // 卡片内边距，内部元素与边框的距离
}

// 区域头部样式
.section-header {
  display: flex; // 弹性布局，标题和按钮水平排列
  justify-content: space-between; // 两端对齐，最大化利用空间
  align-items: center; // 垂直居中对齐
  margin-bottom: $spacing-4; // 底部外边距，与列表内容保持距离

  // 区域标题样式
  .section-title {
    font-size: $text-lg; // 字体大小适中，突出显示
    font-weight: 500; // 字重加粗，增强标题识别度
    color: $gray-700; // 文本颜色，使用中灰色
  }

  // 查看明细按钮样式
  .view-details {
    background: none; // 无背景色，透明效果
    border: none; // 无边框，减少视觉干扰
    color: $primary-color; // 文字颜色，使用主题色
    font-size: $text-sm; // 字体大小较小
    margin: 0rpx; // 无边距，重置默认样式
    &::after {
      border: none; // 隐藏默认按钮边框
    }
  }
}

// 支出分类区域样式
.category-section {
  // 支出分类列表样式
  .category-list {
    // 支出分类项样式
    .category-item {
      margin-bottom: $spacing-3; // 底部外边距，增加项与项之间的间距
    }
  }
}

// 收入来源区域样式
.income-section {
  // 收入来源列表样式
  .category-list {
    // 收入来源项样式
    .category-item {
      margin-bottom: $spacing-3; // 底部外边距，增加项与项之间的间距
    }
  }
}

// 月度对比区域样式
.comparison-section {
  // 对比选项按钮组样式
  .comparison-options {
    display: flex; // 弹性布局，按钮水平排列
    background-color: $gray-100; // 背景色，使用浅灰色
    border-radius: 50rpx; // 圆角，使按钮组看起来更柔和
    padding: $spacing-1; // 内边距，按钮与边框的距离
  }

  // 选项按钮样式
  .option-button {
    border: none; // 无边框，减少视觉干扰
    background: none; // 无背景色，透明效果
    border-radius: 50rpx; // 圆角，与按钮组形状一致
    font-size: 26rpx; // 字体大小适中
    color: $gray-500; // 文字颜色，使用中灰色
    transition: all 0.3s ease; // 过渡效果，使状态切换更平滑

    &::after {
      border: none; // 隐藏默认按钮边框
      padding: 0rpx; // 无边距，重置默认样式
    }

    // 激活状态样式
    &.active {
      background-color: $white; // 背景色为白色，突出显示
      color: $primary-color; // 文字颜色，使用主题色
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 阴影，增强激活状态的视觉效果
    }
  }

  // 对比内容样式
  .comparison-content {
    // 对比项样式
    .comparison-item {
      display: flex; // 弹性布局，标签和值水平排列
      justify-content: space-between; // 两端对齐，最大化利用空间
      align-items: center; // 垂直居中对齐
      padding: $spacing-3 0; // 上下内边距，增加点击区域
      border-bottom: 2rpx solid $gray-100; // 下划线，区分不同对比项

      &:last-child {
        border-bottom: none; // 最后一项无边框，避免底部出现多余分隔线
      }
    }

    // 对比标签样式
    .comparison-label {
      font-size: $text-base; // 字体大小适中
      color: $gray-700; // 文本颜色，使用中灰色
    }

    // 对比值容器样式
    .comparison-values {
      display: flex; // 弹性布局，金额和变化值水平排列
      align-items: center; // 垂直居中对齐
      gap: $spacing-3; // 元素间距，增加视觉清晰度
    }

    // 当前值样式
    .current-value {
      font-size: $text-base; // 字体大小适中
      font-weight: 500; // 字体粗细，突出显示金额
      color: $gray-800; // 文本颜色，使用深灰色
    }

    // 变化值样式
    .comparison-change {
      display: flex; // 弹性布局，图标和文本水平排列
      align-items: center; // 垂直居中对齐
      font-size: $text-xs; // 字体大小较小，作为辅助信息

      // 正值样式（绿色）
      &.positive {
        color: $success-color; // 使用成功色（通常为绿色）表示增长
      }

      // 负值样式（红色）
      &.negative {
        color: $danger-color; // 使用危险色（通常为红色）表示下降
      }
    }

    // 变化文本样式
    .change-text {
      margin-left: $spacing-1; // 左侧间距，与图标保持适当距离
    }
  }
}
</style>
