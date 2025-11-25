<!--
 * 首页组件 index.vue
 * 功能：应用的主页面，展示用户的财务概览
 * 
 * 主要功能模块：
 * 1. 本月预算展示 - 显示总预算、使用情况和每日可支出金额
 * 2. 收支概览卡片 - 展示本月收入、支出和结余
 * 3. 最近交易记录 - 按日期分组显示最近的交易明细
 * 4. 预算调整功能 - 允许用户修改月度预算金额
 -->

<template>
  <!-- 首页容器 -->
  <view class="home-page">
    <view class="home-container">
      <!-- 调整预算弹窗组件 -->
      <!-- 用于让用户修改本月总预算金额 -->
      <dialogVue @Lconfirm="parentConfirm" title="调整预算" v-model="isDialog">
        <template v-slot:default>
          <view class="dialog-body">
            <view class="title">本月预算金额</view>
            <!-- 自定义输入组件，用于输入预算金额 -->
            <view class="input-box">
              <serachVue
                v-model="budget.total"
                @lfocus="parentFocus"
                @lblur="parentBlur"
                :isInput="true"
                :placeholder="String(budget.total)"
                size="35"
              />
            </view>
            <view class="tips">提示：预算金额将影响每日可支出金额计算</view>
          </view>
        </template>
      </dialogVue>

      <!-- 本月预算展示卡片 -->
      <view class="budget-card card">
        <view class="budget-header">
          <text class="budget-title">本月预算</text>
          <!-- 调整预算按钮 -->
          <view class="budget-adjust-btn" @click="showBudgetModal">
            <text class="btn-text">调整预算</text>
          </view>
        </view>

        <!-- 预算概览区域 -->
        <view class="budget-overview">
          <!-- 总预算与剩余百分比 -->
          <view class="budget-summary">
            <view class="budget-info">
              <text class="budget-label">总预算</text>
              <text class="budget-amount">{{
                formatAmount(budget.total)
              }}</text>
            </view>
            <view class="budget-remaining-tag">
              <text class="remaining-text"
                >剩余 {{ budget.remainingPercentage }}%</text
              >
            </view>
          </view>

          <!-- 预算使用进度条 -->
          <view class="budget-progress">
            <view
              class="budget-progress-bar"
              :style="{
                width: `${budget.usedPercentage}%`,
                background: preColor
              }"
            ></view>
          </view>

          <!-- 已使用 & 剩余金额 -->
          <view class="budget-details">
            <text class="budget-used"
              >已使用 {{ formatAmount(budget.used) }}</text
            >
            <text class="budget-remaining"
              >剩余 {{ formatAmount(budget.remaining) }}</text
            >
          </view>
        </view>

        <!-- 每日可支出信息 -->
        <view class="daily-budget">
          <view class="daily-budget-header">
            <view class="daily-info">
              <text class="daily-label">每日可支出</text>
              <text class="daily-amount">{{ formatAmount(budget.daily) }}</text>
            </view>
            <view class="days-remaining">
              <text class="days-text"
                >本月剩余{{ budget.remainingDays }}天</text
              >
            </view>
          </view>
          <!-- 公式说明图标（预留） -->
          <view class="budget-formula">
            <text class="iconfont icon-info-circle"></text>
          </view>
        </view>
      </view>

      <!-- 本月收支概览卡片 -->
      <view class="overview-card card">
        <view class="overview-header">
          <text class="overview-title">本月概览</text>
          <!-- 查看详情跳转按钮 -->
          <view class="overview-detail-btn" @tap="goToMonthlyOverview"
            >查看详情</view
          >
        </view>
        <!-- 收支结余统计 -->
        <view class="overview-stats">
          <view class="stat-item">
            <text class="stat-label">支出</text>
            <text class="stat-value expense">{{
              formatAmount(budget.used)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">收入</text>
            <text class="stat-value income">{{
              formatAmount(overview.income)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">结余</text>
            <text class="stat-value balance">{{
              formatAmount(overview.income - budget.used)
            }}</text>
          </view>
        </view>
      </view>

      <!-- 最近交易记录列表 -->
      <view class="transactions-card card">
        <view class="transactions-header">
          <text class="transactions-title">最近交易</text>
          <!-- 查看全部交易跳转按钮 -->
          <view class="transactions-all-btn" @tap="goToTransactions"
            >查看全部</view
          >
        </view>
        <!-- 按日期分组的交易列表 -->
        <view class="transactions-list">
          <!-- 遍历 groupedTransactions，按日期分组渲染 -->
          <view
            v-for="(transactions, date) in groupedTransactions"
            :key="date"
            class="transactions-group"
          >
            <!-- 日期标签（今天/昨天/具体日期） -->
            <text class="date-label">{{ formatDateLabel(date) }}</text>
            <!-- 每笔交易项 -->
            <view
              class="bill-box"
              v-for="item in transactions"
              :key="item.id"
              @click="newPageBill(item)"
            >
              <!-- 交易卡片组件 -->
              <tranBillVue :data="item">
                <!-- 图标插槽：根据交易类型和图标码渲染图标 -->
                <template>
                  <iconsVue
                    :iconColor="item.iconColor"
                    :iconType="item.type"
                    :iconUcode="item.icon"
                  />
                </template>
                <!-- 时间备注插槽 -->
                <template v-slot:note>
                  <text>{{ formatTime(item.time) }}</text>
                </template>
              </tranBillVue>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 首页逻辑脚本
 * 功能包括：
 * - 显示本月预算、使用情况、每日可支出
 * - 展示本月收支概览（收入、支出、结余）
 * - 列出最近交易记录（按天分组）
 * - 支持调整预算金额
 */

import { ref, reactive, computed, onMounted, watch } from 'vue'
// 组件引入
import tranBillVue from '@/components/tranBill/tranBill.vue' // 交易记录卡片组件
import dialogVue from '@/components/dialog/dialog.vue' // 弹窗组件
import serachVue from '@/components/search/search.vue' // 自定义搜索/输入组件
import iconsVue from '@/components/icons/icons.vue' // 图标组件

// 工具函数
import {
  daysInMonth, // 获取月份天数信息
  formatAmount, // 格式化金额显示
  showToast, // 显示提示信息
  formatTime // 格式化时间
} from '@/untils/index.js'

// 模拟交易数据（实际应来自 API 或 store）
import { transactions } from '@/MXJZdata/indexData.js'

// Pinia 状态管理（用于传递点击的交易项到详情页）
import { transactionStore } from '@/stores/transaction.js'

// 响应式数据
// 控制预算弹窗显示
const isDialog = ref(false)

// 进度条颜色（根据使用比例动态变化）
const preColor = ref('#10b981')

// 获取本月剩余天数
const { remainingDays } = daysInMonth()

// Pinia store 实例
const store = transactionStore()

// 预算数据（初始值，后续可从 store 或 API 加载）
const budget = ref({
  total: 3600, // 总预算
  used: 2345.5, // 已使用金额
  remaining: 1254.5, // 剩余金额（自动计算）
  usedPercentage: 65, // 使用百分比（自动计算）
  remainingPercentage: 35, // 剩余百分比（自动计算）
  daily: 41.82, // 每日可支出（自动计算）
  remainingDays // 本月剩余天数
})

// 本月收入概览（模拟数据）
const overview = reactive({
  income: 8650.0 // 本月总收入
})

/**
 * 计算属性：将交易记录按日期分组（今天、昨天、前天、其他日期）
 * 用于在“最近交易”中按天展示
 */
const groupedTransactions = computed(() => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const dayBeforeYesterday = new Date(today)
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2)

  transactions.forEach((transaction) => {
    const date = new Date(transaction.time)
    let dateKey

    if (date.toDateString() === today.toDateString()) {
      dateKey = 'today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'yesterday'
    } else if (date.toDateString() === dayBeforeYesterday.toDateString()) {
      dateKey = 'dayBeforeYesterday'
    } else {
      // 格式化为 YYYY-MM-DD
      dateKey = date.toISOString().split('T')[0]
    }

    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(transaction)
  })

  return groups
})

/**
 * 重新计算预算相关数据
 * 包括：剩余金额、使用/剩余百分比、每日可支出
 */
const calculateBudgetData = () => {
  budget.value.remaining = budget.value.total - budget.value.used
  budget.value.usedPercentage = Math.round(
    (budget.value.used / budget.value.total) * 100
  )
  budget.value.remainingPercentage = 100 - budget.value.usedPercentage
  // 每日可支出 = 剩余金额 / 剩余天数（保留两位小数）
  budget.value.daily =
    Math.round((budget.value.remaining / budget.value.remainingDays) * 100) /
    100
}

/**
 * 将日期键转换为中文标签（如 "today" → "今天"）
 * @param {string} dateKey - 日期键名（today/yesterday/dayBeforeYesterday 或日期字符串）
 * @returns {string} 格式化后的中文日期标签
 */
const formatDateLabel = (dateKey) => {
  const labels = {
    today: '今天',
    yesterday: '昨天',
    dayBeforeYesterday: '前天'
  }
  return labels[dateKey] || new Date(dateKey).toLocaleDateString('zh-CN')
}

/**
 * 显示调整预算弹窗
 */
const showBudgetModal = () => {
  isDialog.value = true
}

// 输入框聚焦/失焦事件（预留扩展）
const parentFocus = () => {}
const parentBlur = () => {}

/**
 * 用户点击“确认”后处理预算输入
 * 验证输入的预算金额并更新预算数据
 */
const parentConfirm = () => {
  const amount = parseFloat(budget.value.total)
  if (isNaN(amount) || amount <= 0) {
    showToast('请输入有效的金额', 'error')
    return
  }
  isDialog.value = false
  calculateBudgetData() // 重新计算预算数据
}

/**
 * 跳转到交易详情页，并通过 store 传递当前交易项
 * @param {Object} item - 点击的交易记录对象
 */
const newPageBill = (item) => {
  uni.showLoading({ title: '加载中' })
  store.setTransaction(item) // 存入 Pinia store
  uni.hideLoading()
  uni.navigateTo({ url: '/subPages/TransactionDetail/TransactionDetail' })
}

/**
 * 跳转到月度概览页面
 */
const goToMonthlyOverview = () => {
  uni.navigateTo({ url: '/subPages/monthOver/monthOver' })
}

/**
 * 跳转到全部交易记录页面
 */
const goToTransactions = () => {
  uni.navigateTo({ url: '/subPages/billAll/billAll' })
}

/**
 * 监听预算使用比例，动态改变进度条颜色：
 * - ≤50%：绿色（健康）
 * - 50%~70%：橙色（预警）
 * - >70%：红色（超支风险）
 */
watch(
  () => budget.value.usedPercentage,
  (val) => {
    if (val > 70) {
      preColor.value = '#ef4444' // red-500
    } else if (val > 50) {
      preColor.value = '#f59e0b' // amber-500
    } else {
      preColor.value = '#10b981' // emerald-500
    }
  },
  { immediate: true } // 立即执行一次
)

/**
 * 页面加载完成后初始化预算数据
 */
onMounted(() => {
  calculateBudgetData()
})
</script>

<style lang="scss" scoped>
/*
 * 首页样式定义
 * 使用 SCSS 预处理器，包含以下主要样式区域：
 * 1. 基础布局样式（页面容器、卡片样式）
 * 2. 预算卡片样式（标题、调整按钮、预算概览、进度条、每日可支出）
 * 3. 收支概览卡片样式（标题、统计数据）
 * 4. 交易记录卡片样式（标题、分组列表、日期标签）
 * 5. 弹窗样式（预算调整弹窗）
 */

.home-page {
  background-color: $gray-50;
  color: $gray-800;
}

.home-container {
  padding: $spacing-page;
}

/* 通用卡片样式 */
.card {
  background-color: $white;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: $spacing-4;
  padding: $spacing-2;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
    transform: translateY(-2rpx);
  }
}

/* 预算卡片样式 */
.budget-card {
  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-4;
  }

  .budget-title {
    font-size: $text-lg;
    font-weight: 500;
    color: $gray-700;
  }

  .budget-adjust-btn {
    color: $primary-color;
    font-size: $text-sm;
    background: none;
    border: none;
    padding: 0;
  }

  .btn-text {
    margin-left: $spacing-1;
  }
}

/* 预算概览区域样式 */
.budget-overview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: $white;
  border-radius: 20rpx;
  padding: $spacing-4;
  margin-bottom: $spacing-6;

  .budget-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-3;
  }

  .budget-label {
    font-size: $text-sm;
    opacity: 0.8;
    margin-bottom: $spacing-1;
    display: block;
  }

  .budget-amount {
    font-size: $text-2xl;
    font-weight: 700;
  }

  .budget-remaining-tag {
    background-color: rgba($white, 0.2);
    border-radius: 16rpx;
    padding: $spacing-1 $spacing-3;
  }

  .remaining-text {
    font-size: $text-sm;
    font-weight: 500;
  }

  .budget-details {
    display: flex;
    justify-content: space-between;
    font-size: $text-xs;
    opacity: 0.8;
  }
}

/* 每日可支出区域样式 */
.daily-budget {
  background-color: #eff6ff;
  border-radius: 20rpx;
  padding: $spacing-4;

  .daily-budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-3;
  }

  .daily-label {
    font-size: $text-sm;
    color: $primary-dark;
    margin-bottom: $spacing-1;
    display: block;
  }

  .daily-amount {
    font-size: $text-xl;
    font-weight: 700;
    color: $primary-dark;
  }

  .days-remaining {
    background-color: $white;
    border-radius: 16rpx;
    padding: $spacing-2 $spacing-3;
  }

  .days-text {
    font-size: $text-sm;
    color: $primary-dark;
  }

  .budget-formula {
    font-size: $text-xs;
    color: $primary-dark;
    display: flex;
    align-items: flex-start;
  }
}

/* 收支概览卡片样式 */
.overview-card {
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-4;
  }

  .overview-title {
    font-size: $text-lg;
    font-weight: 500;
    color: $gray-700;
  }

  .overview-detail-btn {
    color: $primary-color;
    font-size: $text-sm;
    background: none;
    border: 0;
    padding: 0;
  }

  .overview-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-4;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label {
    font-size: $text-sm;
    color: $gray-500;
    margin-bottom: $spacing-1;
    display: block;
  }

  .stat-value {
    font-size: $text-xl;
    font-weight: 600;

    &.expense {
      color: $danger-color;
    }

    &.income {
      color: $success-color;
    }

    &.balance {
      color: $primary-color;
    }
  }
}

/* 交易记录卡片样式 */
.transactions-card {
  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-4;
  }

  .transactions-title {
    font-size: $text-lg;
    font-weight: 500;
    color: $gray-700;
  }

  .transactions-all-btn {
    color: $primary-color;
    font-size: $text-sm;
    background: none;
    border: none;
    padding: 0;
  }
}

/* 交易记录列表样式 */
.transactions-list {
  .transactions-group {
    margin-top: $spacing-6;

    &:first-child {
      margin-top: 0;
    }
  }

  .date-label {
    font-size: $text-xs;
    color: $gray-500;
    font-weight: 500;
    margin-bottom: $spacing-2;
    display: block;
  }

  .bill-box {
    border-bottom: 1px solid #f1f5f9;
  }
}

/* 预算进度条样式 */
.budget-progress {
  height: 12rpx;
  border-radius: 6rpx;
  background: $white;
  overflow: hidden;
}

.budget-progress-bar {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

/* 弹窗样式 */
.dialog-body {
  width: 100%;

  .title {
    font-size: $text-sm;
    color: $gray-500;
    margin-bottom: 16rpx;
  }

  .input-box {
    padding: 10rpx;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    height: 65rpx;
    margin-bottom: 40rpx;
  }

  .tips {
    font-size: $text-xs;
  }
}
</style>
