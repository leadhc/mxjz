<template>
  <view class="container-dialog" v-if="model">
    <view class="dialog-mark" @click="handerClose"></view>
    <view class="flex-box">
      <view class="header">
        <view class="title">
          {{ title }}
        </view>
        <view class="icon-box" @click="handerClose">
          <uni-icons
            type="closeempty"
            :size="20"
            @click="handerClose"
          ></uni-icons>
        </view>
      </view>

      <view class="body">
        <slot></slot>
      </view>

      <view class="bottom">
        <button class="btn cancel-btn" @click="handerClose">
          {{ cancel }}
        </button>
        <button @click="handerConfirm" class="btn confirm-btn">
          {{ confirm }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineModel, defineEmits } from 'vue'

const model = defineModel()
const emits = defineEmits(['Lclose', 'Lconfirm'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  cancel: {
    type: String,
    default: '取消'
  },
  confirm: {
    type: String,
    default: '确定'
  }
})

const handerClose = () => {
  model.value = false
  emits('Lclose')
}

const handerConfirm = () => {
  emits('Lconfirm')
}
</script>

<style lang="scss" scoped>
.container-dialog {
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 999;
  box-sizing: border-box;

  .dialog-mark {
    height: inherit;
    width: inherit;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .flex-box {
    position: absolute;
    width: 80%;

    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    background: $white;
    padding: 40rpx;
    border-radius: 32rpx;
    background: $white;
    box-sizing: border-box;

    .header {
      margin-bottom: 40rpx;
      display: flex;
      align-items: center;

      .title {
        font-size: $text-base;
        font-weight: 600;
        flex: 1;
      }
    }

    .body {
      margin-bottom: 40rpx;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn {
        margin: 0rpx;
        padding: 0rpx;
        height: 80rpx;
        width: 180rpx;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12rpx;
        font-size: $text-base;
        &::after {
          border: none;
          padding: 0rpx;
          margin: 0rpx;
        }
      }

      .cancel-btn {
        background: $gray-100;
        color: $gray-500;
      }

      .confirm-btn {
        color: $white;
        background: $primary-color;
      }
    }
  }
}
</style>
