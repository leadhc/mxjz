<template>
  <!-- 搜索组件主容器 -->
  <view class="container-input">
    <!-- 内容区域 -->
    <view class="content">
      <!-- 输入模式 -->
      <view class="input-box" v-if="isInput">
        <view class="flex-input">
          <input
            @input="handerInput"
            @focus="handerFocus"
            @blur="handerBlur"
            @confirm="handerConfirm"
            :value="modelValue"
            :style="{ fontSize: size + 'rpx', textAlign: align }"
            class="input"
            type="text"
            :placeholder="placeholder"
            confirm-type="{{done}}"
          />
          <!-- 自定义插槽 -->
          <slot v-if="$slots.default"></slot>
        </view>
      </view>
      <!-- 非输入模式 -->
      <view v-else>
        <view class="no-search">
          <uni-icons v-if="isIcon" fontFamily="iconfont" :size="30">{{
            '\ue667'
          }}</uni-icons>
          <view class="text">{{ placeholder }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import iconsVue from '@/components/icons/icons.vue'

// 定义组件属性
const props = defineProps({
  /**
   * 输入框的值（双向绑定）
   */
  modelValue: String,
  /**
   * 是否为输入模式
   */
  isInput: {
    type: Boolean,
    default: false
  },
  /**
   * 占位符文本
   */
  placeholder: {
    type: [String, Array],
    default: '请传入相应的值'
  },
  /**
   * 字体大小（rpx）
   */
  size: {
    type: String,
    default: '30'
  },
  /**
   * 文本对齐方式
   */
  align: {
    type: String,
    default: 'left'
  },
  /**
   * 是否显示图标
   */
  isIcon: {
    type: Boolean,
    default: false
  }
})

// 定义组件事件
const emits = defineEmits(['update:modelValue', 'lfocus', 'lblur', 'lconfirm'])

/**
 * 处理输入事件
 * @param {Object} e - 输入事件对象
 */
const handerInput = (e) => {
  emits('update:modelValue', e.detail.value)
}

/**
 * 处理焦点事件
 */
const handerFocus = () => {
  emits('lfocus')
}

/**
 * 处理失焦事件
 */
const handerBlur = () => {
  emits('lblur')
}

/**
 * 处理确认事件
 */
const handerConfirm = () => {
  emits('lconfirm')
}
</script>

<style lang="scss" scoped>
// 搜索组件样式
.container-input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  // 内容区域
  .content {
    height: 100%;
    width: 100%;
    background: transparent;

    // 输入框区域
    .input-box {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      column-gap: $spacing-2;
      position: relative;

      // 输入框容器
      .flex-input {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-right: 20rpx;
      }

      // 输入框样式
      .input {
        flex: 1;
        height: 100%;
        padding-left: 20rpx;
        background: transparent;
      }

      // 图标样式
      .icons {
        height: 40rpx;
        width: 40rpx;
        .img {
          display: block;
          height: 100%;
          width: 100%;
        }
      }
    }

    // 非搜索模式
    .no-search {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
