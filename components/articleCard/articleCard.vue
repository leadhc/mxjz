<template>
  <view class="posts-list">
    <!-- 文章头部信息 -->
    <view class="post-header">
      <articleAvatarVue :data="item.author" :isTabs="true">
        <template>
          <text style="font-size: 25rpx">{{ item.time }}</text>
        </template>
      </articleAvatarVue>
    </view>

    <!-- 文章标题 -->
    <text class="post-title">{{ item.title }}</text>
    <!-- 文章摘要 -->
    <text class="post-excerpt">{{ item.excerpt }}</text>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'
import articleAvatarVue from '@/components/articleAvatar/articleAvatar.vue'

// 定义组件的属性，其中 `item` 是必需的对象类型
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.posts-list {
  /* 假设这里原本有 .post-card 的样式，但现在不使用 */
}

.post-header {
  // display: flex;
  // justify-content: space-between;
  // align-items: flex-start;
  margin-bottom: $spacing-3;
}

.post-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: $spacing-3;
}

.author-info {
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

/* 以下样式未在模板中使用 */
/*
.post-more {
  background: none;
  border: none;
  color: $gray-400;
  font-size: $text-base;
  padding: $spacing-1;

  &:hover {
    color: $gray-600;
  }
}
*/

.post-title {
  height: 100rpx;
  font-size: $text-lg;
  font-weight: 600;
  color: $gray-800;
  margin-bottom: $spacing-2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 控制显示几行 */
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.4;
}

.post-excerpt {
  height: 44rpx;
  font-size: $text-sm;
  color: $gray-600;
  margin-bottom: $spacing-3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 控制显示几行 */
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
}

/* 下面的样式块未在模板中使用 */
/*
.post-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.stat-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: $gray-500;
  font-size: $text-sm;
  transition: color 0.2s ease;

  &:hover {
    color: $primary-color;
  }
}

.stat-count {
  margin-left: $spacing-1;
}

.text-box {
  display: flex;
  align-items: center;
}
*/
</style>
