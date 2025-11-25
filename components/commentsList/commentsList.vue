<template>
  <view>
    <!-- 评论上下文 -->
    <view class="comment-context">
      <text class="context-text">评论了</text>
      <text class="author-name">{{ data.author }}</text>
      <text class="context-text">的帖子</text>
      <view>
        <text class="time">{{ data.time }}</text>
      </view>
    </view>

    <!-- 帖子标题 -->
    <view class="post-title">
      <text>{{ data.postTitle }}</text>
    </view>
    <!-- 评论内容 -->
    <view class="comment-content">
      {{ data.content }}
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.comment-context {
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 20rpx;
}

.context-text {
  color: $gray-500;
}

.author-name {
  color: $primary-color;
  font-weight: 500;
  margin: 0 6rpx;
}

.time {
  font-size: 22rpx;
  color: $gray-400;
  margin-bottom: 16rpx;
}

.post-title {
  font-size: 30rpx;
  color: $gray-800;
  line-height: 1.5;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.comment-content {
  font-size: 26rpx;
  color: $gray-600;
  line-height: 1.6;
  background-color: $gray-50;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
</style>
