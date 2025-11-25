<!--
 * 交易记录组件 tranBill.vue
 * 功能：用于显示单条交易记录，包括交易标题、金额、备注和可选的进度条
 * 
 * 主要特性：
 * 1. 支持自定义图标（通过默认插槽）
 * 2. 支持自定义备注内容（通过命名插槽）
 * 3. 根据交易类型（收入/支出）显示不同颜色的金额
 * 4. 可选显示进度条（如用于预算使用进度展示）
 * 5. 金额格式化显示
 -->

<template>
  <view class="container-bill">
    <view class="content-box">
      <view class="flex">
        <!-- 自定义图标区域（通过默认插槽实现） -->
        <view v-if="$slots.default" class="icon">
          <slot></slot>
        </view>

        <!-- 文本信息区域 -->
        <view class="text-box">
          <!-- 交易标题 -->
          <view class="text">{{ data.title }}</view>

          <!-- 备注信息（通过命名插槽实现） -->
          <view class="time">
            <slot name="note"></slot>
          </view>

          <!-- 进度条（可选显示） -->
          <view class="progress-bar" v-if="isProgress">
            <view
              class="progress-fill"
              :style="{
                width: `${data.percentage}%`,
                backgroundColor: data.iconColor
              }"
            ></view>
          </view>
        </view>

        <!-- 金额显示区域 -->
        <!-- 根据交易类型（收入/支出）显示不同颜色 -->
        <view
          :style="{ color: data.type === 'expense' ? '#ef4444' : '#10b981' }"
          class="mon"
          >{{
            data.type === 'expense'
              ? '-' + formatAmount(data.amount)
              : '+' + formatAmount(data.amount)
          }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 交易记录组件脚本
 * 定义了组件的属性和功能
 */

import { defineProps } from 'vue'
import { formatAmount } from '../../untils' // 导入金额格式化工具函数

// 定义组件属性
const props = defineProps({
  data: {
    type: [Array, Object], // 数据类型可以是数组或对象
    required: true, // 必填属性
    description: '交易数据，包含title、amount、type、percentage等字段'
  },
  isProgress: {
    type: Boolean, // 布尔类型
    default: false, // 默认不显示进度条
    description: '是否显示进度条'
  }
})
</script>

<style lang="scss" scoped>
/*
 * 交易记录组件样式定义
 * 使用 SCSS 预处理器，包含以下主要样式区域：
 * 1. 容器布局样式
 * 2. 内容区域样式
 * 3. 图标区域样式
 * 4. 文本信息区域样式
 * 5. 金额显示样式
 * 6. 进度条样式
 */

.container-bill {
  width: 100%;

  .content-box {
    height: 120rpx; // 固定高度
    padding-top: $spacing-2; // 顶部内边距
    padding-bottom: $spacing-2; // 底部内边距
    box-sizing: border-box; // 盒模型设置

    .flex {
      height: 100%;
      display: flex; // 使用flex布局
      justify-content: flex-start; // 水平对齐方式
      align-items: center; // 垂直对齐方式

      // 图标区域样式
      .icon {
        height: 100%;
        width: 82rpx; // 固定宽度
        border-radius: 50%; // 圆形边框
        margin-right: 20rpx; // 右侧外边距
      }

      // 文本信息区域样式
      .text-box {
        height: 100%;
        flex: 1; // 占满剩余空间

        // 交易标题样式
        .text {
          font-size: $text-base; // 基础字体大小
          font-weight: 500; // 中等粗细
        }

        // 备注信息样式
        .time {
          font-size: $text-xs; // 小号字体大小
        }

        // 进度条容器样式
        .progress-bar {
          height: 8rpx; // 高度
          background-color: $gray-200; // 背景色
          border-radius: 4rpx; // 圆角
          overflow: hidden; // 隐藏溢出部分
          margin-top: $spacing-1; // 顶部外边距
        }

        // 进度条填充样式
        .progress-fill {
          height: 100%; // 高度占满
          border-radius: 4rpx; // 圆角
          transition: width 0.5s ease; // 宽度变化动画
        }
      }

      // 金额显示样式
      .mon {
        height: 100%;
        max-width: 180rpx; // 最大宽度
        flex: 1; // 占满剩余空间
        font-weight: 800; // 粗体
        font-size: $text-base; // 基础字体大小
        text-align: right; // 右对齐
        display: flex;
        justify-content: flex-end; // 水平右对齐
        align-items: center; // 垂直居中对齐
      }
    }
  }
}
</style>
