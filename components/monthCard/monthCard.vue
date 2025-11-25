<template>
  <view class="stat-card income" :style="{ borderColor: data.color }">
    <text class="stat-title">{{ data.title }}</text>
    <text class="stat-value">{{
      data.budget ? data.budget + '%' : formatAmount(data.amount)
    }}</text>
    <view class="stat-change">
      <text class="iconfont"></text>
      <text class="change-text" :style="{ color: textPrecent }">{{
        `${data.changeText ? data.changeText : Math.abs(data.changes) + '% 较上月'}`
      }}</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import { formatAmount } from '@/untils/index.js'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const textPrecent = computed(() => {
  const changes = props.data.changes || 0
  if (changes > 0) {
    return '#10b981'
  } else {
    return '#ef4444'
  }
})
</script>

<style lang="scss" scoped>
.stat-card {
  background-color: $white;
  border-radius: 20rpx;
  padding: $spacing-4;
  border-left: 6rpx solid;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

  &.income {
    border-left: 6rpx solid $success-color;
  }

  &.expense {
    border-left: 6rpx solid $danger-color;
  }

  &.budget {
    border-left: 6rpx solid $primary-color;
  }

  &.daily {
    border-left: 6rpx solid #8b5cf6;
  }

  .stat-title {
    font-size: $text-sm;
    color: $gray-500;
    margin-bottom: $spacing-2;
    display: block;
  }

  .stat-value {
    font-size: $text-xl;
    font-weight: 600;
    margin-bottom: $spacing-2;
    display: block;
  }

  .stat-change {
    display: flex;
    align-items: center;
    font-size: $text-xs;

    &.positive {
      color: $success-color;
    }

    &.negative {
      color: $danger-color;
    }

    &.normal {
      color: $success-color;
    }

    &.warning {
      color: $warning-color;
    }

    &.danger {
      color: $danger-color;
    }
  }

  .change-text {
    margin-left: $spacing-1;
  }
}
</style>
