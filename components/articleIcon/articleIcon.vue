<template>
  <view class="container-icon">
    <view class="content">
      <view class="icon-box like-box" @click="handerLike">
        <uni-icons
          fontFamily="iconfont"
          :size="iconSize"
          :color="acitveLike ? '#3b82f6' : 'balck'"
          >{{ '\ue600' }}</uni-icons
        >
        <view :style="{ color: acitveLike ? '#3b82f6' : 'black' }">{{
          data.like
        }}</view>
      </view>
      <view class="icon-box common-box" @click="handerCom">
        <uni-icons fontFamily="iconfont" :size="iconSize" :color="iconColor">{{
          '\ue891'
        }}</uni-icons>
        <view>{{ data.comment }}</view>
      </view>
      <view class="icon-box collect-box" v-if="isColl" @click="handerColl">
        <uni-icons
          fontFamily="iconfont"
          :size="iconSize"
          :color="activeCollect ? '#3b82f6' : 'balck'"
          >{{ '\ue613' }}</uni-icons
        >
        <view :style="{ color: activeCollect ? '#3b82f6' : 'black' }">{{
          activeCollect ? '已收藏' : '收藏'
        }}</view>
      </view>
      <view class="icon-box share-box" v-if="isShare">
        <button
          class="share-btn"
          @click="handerShare"
          open-type="share"
          size="mini"
        >
          <uni-icons
            fontFamily="iconfont"
            :size="iconSize"
            :color="iconColor"
            >{{ '\uebab' }}</uni-icons
          >
          <view>分享</view>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const iconColor = ref('')

const props = defineProps({
  isShare: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: String,
    default: '16'
  },
  isColl: {
    type: Boolean,
    default: true
  },
  acitveLike: {
    type: Boolean,
    default: false
  },

  activeCollect: {
    type: Boolean,
    default: false
  },

  collect: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

console.log(props.data, 'data')

const emits = defineEmits(['like', 'common', 'collect', 'share'])

const handerLike = () => {
  emits('like')
}

const handerCom = () => {
  emits('common')
}

const handerColl = () => {
  emits('collect')
}

const handerShare = () => {
  emits('share')
}
</script>

<style lang="scss" scoped>
.container-icon {
  height: 100%;
  width: 100%;

  .content {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .icon-box {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .share-btn {
      padding: 0rpx;
      margin: 0rpx;
      border: none;
      background: transparent;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 32rpx;
      &::after {
        display: none;
      }
    }
  }
}
</style>
