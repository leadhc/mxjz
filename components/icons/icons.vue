<!--
 * 图标组件 icons.vue
 * 功能：
 * - 用于展示不同类型的交易图标（收入/支出）
 * - 支持自定义图标大小、颜色、背景色和尺寸
 * - 根据图标类型自动设置默认颜色和背景
 * - 使用unicode编码显示图标字符
 -->

<template>
  <!-- 图标容器 -->
  <view class="container-icon">
    <!-- 图标盒子，动态设置背景色和尺寸 -->
    <view
      :style="{
        background: finalIconBack,
        minHeight: backHeight + 'rpx',
        minWidth: backHeight + 'rpx'
      }"
      class="icon-box"
    >
      <!-- 图标显示组件 -->
      <uni-icons fontFamily="iconfont" :color="iconColor" :size="iconSize">
        {{ iconChar }}
      </uni-icons>
    </view>
  </view>
</template>

<script setup>
/**
 * 图标组件脚本部分
 * 功能：定义组件属性、计算属性和核心功能
 */

import { defineProps, computed } from 'vue'

// 定义组件属性
const props = defineProps({
  /**
   * 图标类型（用于确定默认颜色和背景色）
   * @type {string} 'expense'表示支出，'income'表示收入
   * @required
   */
  iconType: {
    type: String,
    required: true,
    description:
      '图标类型，expense表示支出，income表示收入，用于确定默认颜色和背景色'
  },

  /**
   * 图标大小（像素单位）
   * @type {string}
   * @default '20'
   */
  iconSize: {
    type: String,
    default: '20',
    description: '图标大小，单位为像素，默认20px'
  },

  /**
   * 图标背景高度（rpx单位），宽度会自动与高度保持一致
   * @type {string}
   * @default '82'
   */
  backHeight: {
    type: String,
    default: '82',
    description: '图标背景高度，单位为rpx，宽度会自动与高度保持一致，默认82rpx'
  },

  /**
   * 图标Unicode编码（十六进制字符串）
   * @type {string}
   * @required
   */
  iconUcode: {
    type: String,
    required: true,
    description:
      '图标Unicode编码，以十六进制字符串形式传入，用于显示具体的图标字符'
  },

  /**
   * 图标颜色（十六进制颜色值）
   * @type {string}
   */
  iconColor: {
    type: String,
    description: '图标颜色，以十六进制颜色值形式传入，如#ff0000'
  },

  /**
   * 图标背景色（十六进制颜色值）
   * @type {string}
   * @default ''
   */
  iconBack: {
    type: String,
    default: '',
    description:
      '图标背景色，以十六进制颜色值形式传入，为空时根据iconType使用默认值'
  }
})

/**
 * 将十六进制Unicode编码转换为实际的字符
 * @returns {string} 转换后的字符，如果转换失败则返回空字符串
 */
const iconChar = computed(() => {
  // 将十六进制字符串转换为整数
  const code = parseInt(props.iconUcode, 16)
  // 检查转换是否成功
  if (isNaN(code)) return ''
  // 使用String.fromCodePoint将Unicode码点转换为字符
  return String.fromCodePoint(code)
})

/**
 * 计算最终的图标背景色
 * 优先级：传入的iconBack > 根据iconType的默认背景色
 * @returns {string} 最终的背景色值
 */
const finalIconBack = computed(() => {
  // 如果通过props传递了iconBack，优先使用
  if (props.iconBack) {
    return props.iconBack
  }

  // 否则根据iconType返回默认背景色
  if (props.iconType === 'expense') {
    return '#fee2e2' // 支出图标默认背景色：浅红色
  }
  if (props.iconType === 'income') {
    return '#dcfce7' // 收入图标默认背景色：浅绿色
  }

  return '' // 默认无背景色
})

/**
 * 计算最终的图标颜色
 * 优先级：传入的iconColor > 根据iconType的默认颜色
 * @returns {string} 最终的图标颜色值
 */
const finalIconColor = computed(() => {
  if (props.iconColor) {
    return props.iconColor
  }

  // 否则根据iconType返回默认背景色
  if (props.iconType === 'expense') {
    return '#ef4444' // 支出图标默认颜色：红色
  }
  if (props.iconType === 'income') {
    return '#10b981' // 收入图标默认颜色：绿色
  }

  return '' // 默认无颜色
})
</script>

<style scoped lang="scss">
/**
 * 图标组件样式定义
 * 样式结构：
 * - 容器样式：整体布局和对齐方式
 * - 图标盒子样式：边框圆角和居中对齐
 * - 文本盒子样式：图标下方文本的样式（预留）
 */

/* 图标容器样式 */
.container-icon {
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列（为可能的文本预留）
  align-items: center; // 水平居中对齐
  justify-content: center; // 垂直居中对齐

  /* 图标盒子样式 */
  .icon-box {
    display: flex; // 弹性布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    border-radius: 50%; // 圆角边框，确保图标背景为圆形
  }

  /* 文本盒子样式（预留，可用于在图标下方显示文本） */
  .text-box {
    margin-top: 20rpx; // 与图标之间的间距
    font-size: $text-base; // 字体大小：使用全局变量
    text-align: center; // 文本居中对齐
  }
}
</style>
