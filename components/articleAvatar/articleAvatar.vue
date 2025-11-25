<template>
  <view class="post-headers">
    <view class="author-info">
      <image :src="data.avatar" class="author-avatar" />
      <view class="author-details">
        <text class="author-name">{{ data.name }}</text>
        <slot v-if="$slots.default"></slot>
      </view>
    </view>
    <view class="left">
      <button
        v-if="isFollow"
        class="more-button"
        size="mini"
        @click="handerFoolow"
        :style="{
          background: activeFollow ? '#f3f4f6' : '#2563ebbf',
          color: activeFollow ? 'black' : 'white'
        }"
      >
        {{ activeFollow === true ? '已关注' : '关注' }}
      </button>
      <view class="tabs" v-if="isTabs"> 分类标签 </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  isFollow: {
    type: Boolean,
    default: false
  },
  isTabs: {
    type: Boolean,
    default: false
  },
  activeFollow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['follow'])

const handerFoolow = () => {
  emits('follow')
}
</script>

<style lang="scss" scoped>
.post-headers {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;
}

.author-info {
  display: flex;
  flex: 1;
  align-items: center;
  margin-right: 30rpx;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: $spacing-3;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: $text-base;
  font-weight: 500;
  color: $gray-800;
  margin-bottom: $spacing-1;
}

.post-time {
  font-size: $text-xs;
  color: $gray-500;
}

.more-button {
  background: #2563ebbf;
  border: none;
  width: 110rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $gray-400;
  font-size: $text-base;
  padding: 0rpx;
  color: white;
  font-size: $text-xs;
  padding: 0rpx 20rpx;
  margin: 0rpx;

  &::after {
    display: none;
  }
}

.left {
  .tabs {
    background: #dbeafe;
    color: #2563eb;
    padding: 10rpx 20rpx 10rpx 20rpx;
    font-size: $text-xs;
    border-radius: 60rpx;
  }
}
</style>
