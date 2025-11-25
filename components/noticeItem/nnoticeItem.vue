<!-- noticeItemVue.vue -->
<template>
  <view class="setting-box">
    <view class="setting-details">
      <text class="setting-title">{{ title }}</text>
      <text v-if="desc" class="setting-desc">{{ desc }}</text>
    </view>
    <view
      class="custom-switch"
      :class="{
        'switch-checked': internalChecked,
        'switch-disabled': disabled
      }"
      @click="handleClick"
    >
      <!-- 滑块轨道 -->
      <view class="switch-track">
        <!-- 滑块圆点 -->
        <view class="switch-thumb"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' }, // 允许为空
  color: { type: String, default: '#3b82f6' },
  type: { type: String, required: true },
  checked: { type: Boolean, default: true, required: true },
  disabled: { type: Boolean, default: false }
})

const emits = defineEmits(['confirmSwitch'])

const internalChecked = ref(props.checked)

// 监听父组件传入的 checked 变化（用于外部重置）
watch(
  () => props.checked,
  (newVal) => {
    internalChecked.value = newVal
  },
  { immediate: true }
)

const handleClick = () => {
  if (props.disabled) return
  const newValue = !internalChecked.value

  // 触发事件，通知父组件
  emits('confirmSwitch', {
    type: props.type,
    newValue,
    oldValue: props.checked
  })
}
</script>

<style lang="scss" scoped>
.setting-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .setting-details {
    flex: 1;
    margin-right: 20rpx;
  }

  .setting-title {
    font-size: $text-base;
    color: $gray-800;
    margin-bottom: $spacing-1;
    display: block;
  }

  .setting-desc {
    font-size: $text-sm;
    color: $gray-500;
    display: block;
  }
}

// 自定义 Switch 样式
.custom-switch {
  width: 96rpx;
  height: 48rpx;
  position: relative;
  user-select: none;
}

.switch-track {
  width: 100%;
  height: 100%;
  background-color: #ccc; /* 默认灰色 */
  border-radius: 24rpx;
  position: relative;
  transition: background-color 0.3s ease;
}

.switch-thumb {
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 开启状态 */
.custom-switch.switch-checked .switch-track {
  background-color: v-bind(color); /* 使用 props.color */
}

.custom-switch.switch-checked .switch-thumb {
  transform: translateX(48rpx); /* 96 - 40 - 4 - 4 = 48rpx */
}

/* 禁用状态 */
.custom-switch.switch-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
