<template>
  <!-- 我的页面 -->
  <view class="user-page">
    <view class="user-container">
      <!-- 个人信息 -->
      <view class="profile-card card">
        <view class="profile-header">
          <image
            :src="useUserStore.userInfo.avatarUrl || userInfo.avatar"
            class="user-avatar"
          />
          <view class="user-info" v-if="useUserStore.userInfo">
            <view class="user-name-section">
              <text class="user-name">{{
                useUserStore.userInfo.nickName
              }}</text>
              <view v-if="false" class="vip-badge">VIP会员</view>
            </view>
            <text class="user-record-days"
              >已坚持记账 {{ userInfo.recordDays }} 天</text
            >
          </view>
          <view class="no-login" v-else>
            <button
              @click="loginNow"
              class="btn"
              :loading="loginLoading"
              :disabled="loginLoading"
            >
              立即登录
            </button>
          </view>
        </view>

        <view class="user-stats" v-if="useUserStore.userInfo">
          <view class="stat-item">
            <text class="stat-label">总支出</text>
            <text class="stat-value">{{
              formatAmount(userStats.totalAssets)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">本月结余</text>
            <text class="stat-value income">{{
              formatAmount(userStats.monthlyBalance)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">预算使用率</text>
            <text class="stat-value primary"
              >{{ userStats.budgetAchievement }}%</text
            >
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="function-menu card" v-if="useUserStore.userInfo">
        <text class="card-title">功能菜单</text>
        <view class="menu-items">
          <view class="menu-item" @click="newPageFollow">
            <iconsVue
              iconType="''"
              iconBack="#dbeafe"
              iconColor="#3b82f6"
              iconUcode="e633"
              iconSize="30"
              backHeight="100"
            />
            <view class="item-text">关注</view>
          </view>
          <view class="menu-item" @click="newPageLike">
            <iconsVue
              iconType="''"
              iconBack="#fee2e2"
              iconColor="#ef4444"
              iconUcode="e600"
              iconSize="25"
              backHeight="100"
            />
            <view class="item-text">点赞</view>
          </view>
          <view class="menu-item" @click="newPageCollect">
            <iconsVue
              iconType="''"
              iconBack="#fef9c3"
              iconColor="#eab308"
              iconUcode="e613"
              iconSize="25"
              backHeight="100"
            />
            <view class="item-text">收藏</view>
          </view>
          <view class="menu-item" @click="newPageCommon">
            <iconsVue
              iconType="''"
              iconBack="#dcfce7"
              iconColor="#22c55e"
              iconUcode="e891"
              iconSize="25"
              backHeight="100"
            />
            <view class="item-text">评论</view>
          </view>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-card card" v-if="useUserStore.userInfo">
        <text class="card-title">记账统计</text>
        <view class="stats-list">
          <view class="stat-row">
            <view class="stat-info">
              <text class="stat-text">连续记账</text>
            </view>
            <text class="stat-number">{{ userStats.continuousDays }} 天</text>
          </view>
          <view class="stat-row">
            <view class="stat-info">
              <text class="stat-text">总记账次数</text>
            </view>
            <text class="stat-number">{{ userStats.totalRecords }} 次</text>
          </view>
          <view class="stat-row">
            <view class="stat-info">
              <text class="stat-text">累计支出</text>
            </view>
            <text class="stat-number">{{
              formatAmount(userStats.totalExpenses)
            }}</text>
          </view>
          <view class="stat-row">
            <view class="stat-info">
              <text class="stat-text">累计收入</text>
            </view>
            <text class="stat-number">{{
              formatAmount(userStats.totalIncome)
            }}</text>
          </view>
        </view>
      </view>

      <!-- 设置选项 -->
      <view class="settings-card card" v-if="useUserStore.userInfo">
        <text class="card-title">系统设置</text>
        <view class="settings-list">
          <view class="setting-item" @click="newPageInfo">
            <view class="setting-info">
              <text class="setting-text">个人信息</text>
            </view>
          </view>
          <view class="setting-item" @click="newPageNotice">
            <view class="setting-info">
              <text class="setting-text">通知设置</text>
            </view>
          </view>
          <view class="setting-item" @click="newPageHelp">
            <view class="setting-info">
              <text class="setting-text">帮助与反馈</text>
            </view>
          </view>
          <view class="setting-item logout" @click="handleLogout">
            <view class="setting-info">
              <text class="setting-text">退出登录</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { userStore } from '@/stores/user.js'
import iconsVue from '@/components/icons/icons.vue'
import { formatAmount } from '@/untils/index.js'

const useUserStore = userStore()
const loginLoading = ref(false)

const userInfo = reactive({
  name: '记账达人',
  avatar: 'https://s.coze.cn/image/avtwY8_nguI/',
  recordDays: 365
})

const userStats = reactive({
  totalAssets: 28650.0,
  monthlyBalance: 6304.5,
  budgetAchievement: 65,
  continuousDays: 128,
  totalRecords: 1562,
  totalExpenses: 45628.5,
  totalIncome: 128650.0
})

const loginNow = async () => {
  loginLoading.value = true
  await useUserStore.login()
  setTimeout(() => {
    loginLoading.value = false
  }, 3000)
}

const newPageFollow = () => {
  uni.navigateTo({ url: '/subPages/myFollow/myFollow' })
}

const newPageLike = () => {
  uni.navigateTo({
    url: '/subPages/myLikeandCollect/myLikeandCollect?title=我的点赞'
  })
}

const newPageCollect = () => {
  uni.navigateTo({
    url: '/subPages/myLikeandCollect/myLikeandCollect?title=我的收藏'
  })
}

const newPageCommon = () => {
  uni.navigateTo({ url: '/subPages/myCommon/myCommon' })
}

const newPageInfo = () => {
  uni.navigateTo({
    url: '/subPages/personInfo/personInfo'
  })
}

const newPageNotice = () => {
  uni.navigateTo({
    url: '/subPages/noticeSetting/noticeSetting'
  })
}

const newPageHelp = () => {
  uni.navigateTo({
    url: '/subPages/helpfeed/helpfeed'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        useUserStore.loginOut()
        uni.showToast({ title: '退出登录成功', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.user-page {
  background-color: $gray-50;
  color: $gray-800;
  min-height: 100vh;
}

.user-container {
  padding: $spacing-page;
}

.card {
  background-color: $white;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: $spacing-4;
  padding: $spacing-page;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
    transform: translateY(-2rpx);
  }
}

.card-title {
  font-size: $text-lg;
  font-weight: 500;
  color: $gray-700;
  margin-bottom: $spacing-4;
  display: block;
}

.profile-card {
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-4;
  }

  .user-avatar {
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
    margin-right: $spacing-4;
    border: 4rpx solid #dbeafe;
    box-sizing: border-box;
  }

  .user-info {
    flex: 1;
  }

  .user-name-section {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-1;
  }

  .user-name {
    font-size: $text-xl;
    font-weight: 600;
    color: $gray-800;
    margin-right: $spacing-2;
  }

  .vip-badge {
    background-color: #dbeafe;
    color: $primary-color;
    font-size: $text-xs;
    padding: $spacing-1 $spacing-2;
    border-radius: 20rpx;
    font-weight: 500;
  }

  .user-record-days {
    font-size: $text-sm;
    color: $gray-500;
  }

  .no-login {
    border-bottom: 2px solid #3b82f6;

    .btn {
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      margin: 0;
      padding: 0;
      color: #3b82f6;

      &::after {
        display: none;
      }
    }
  }
}

.user-stats {
  display: flex;
  justify-content: space-between;

  .stat-item {
    text-align: center;
    flex: 1;
  }

  .stat-label {
    font-size: $text-sm;
    color: $gray-500;
    margin-bottom: $spacing-1;
    display: block;
  }

  .stat-value {
    font-size: $text-lg;
    font-weight: 600;

    &.income {
      color: $success-color;
    }

    &.primary {
      color: $primary-color;
    }
  }
}

.function-menu {
  .menu-items {
    display: flex;
    justify-content: space-around;
    gap: 40rpx;

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      .item-text {
        margin-top: 20rpx;
      }
    }
  }
}

.stats-card {
  .stats-list {
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-3 0;
      border-bottom: 2rpx solid $gray-100;

      &:last-child {
        border-bottom: none;
      }
    }

    .stat-info {
      display: flex;
      align-items: center;
    }

    .stat-text {
      font-size: $text-base;
      color: $gray-700;
      // margin-left: 10rpx;
    }

    .stat-number {
      font-size: $text-base;
      font-weight: 500;
      color: $gray-800;
    }
  }
}

.settings-card {
  .settings-list {
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-3;
      padding-left: 0;
      border-radius: 12rpx;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $gray-50;
      }

      &.logout {
        margin-top: $spacing-2;
      }
    }

    .setting-text {
      font-size: $text-base;
      color: $gray-700;
    }
  }
}

.primary {
  color: $primary-color;
}

.success {
  color: $success-color;
}

.danger {
  color: $danger-color;
}
</style>
