<template>
  <!-- 交易记录页面主容器 -->
  <view class="transactions-page">
    <view class="transactions-container">
      <!-- 筛选区域 + 统计摘要 -->
      <view class="filter-section card" v-if="filteredTransactions.length > 0">
        <!-- 日期筛选和类型筛选区域 -->
        <view class="date-filter">
          <!-- 日期选择器 -->
          <view class="month-box">
            <uni-datetime-picker
              type="date"
              :clear-icon="false"
              v-model="selectedDate"
              @change="handleDateChange"
            >
              选择日期
            </uni-datetime-picker>
          </view>

          <!-- 类型筛选 Tab -->
          <view class="filter-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.type"
              class="filter-tab"
              :class="{ active: activeFilter === tab.type }"
              @click="handleTabClick(tab.type)"
            >
              {{ tab.label }}
            </button>
          </view>
        </view>

        <!-- 统计信息区域 -->
        <view class="stats-summary">
          <view class="stat-item">
            <text class="stat-label">总收入</text>
            <text class="stat-value income">{{
              formatCurrency(stats.totalIncome)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">总支出</text>
            <text class="stat-value expense">{{
              formatCurrency(stats.totalExpense)
            }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">交易笔数</text>
            <text class="stat-value">{{ filteredTransactions.length }}</text>
          </view>
        </view>
      </view>

      <!-- 交易列表区域 -->
      <view class="transactions-list">
        <view v-if="filteredTransactions.length === 0" class="empty-state">
          <text class="iconfont icon-receipt"></text>
          <text class="empty-title">暂无交易记录</text>
          <text class="empty-desc">当前筛选条件下没有找到交易记录</text>
        </view>

        <view class="transactions-group" v-else>
          <swiper
            class="swiper"
            @change="handleSwiperChange"
            :current="currentTabIndex"
            :circular="true"
          >
            <swiper-item v-for="tab in tabs" :key="tab.type" class="item">
              <scroll-view
                class="bill"
                scroll-y="true"
                :show-scrollbar="false"
                enhanced="true"
                @scrolltolower="handleScrollToLower"
              >
                <view
                  v-for="trans in getTransactionsByType(tab.type)"
                  :key="trans.id"
                  class="bill-box"
                  @click="navigateToDetail(trans)"
                >
                  <tranBillVue :data="trans">
                    <template #default>
                      <iconsVue
                        :iconType="trans.type"
                        :iconUcode="trans.icon"
                        :iconColor="trans.iconColor"
                      />
                    </template>
                    <template #note>
                      <text>{{ formatTime(trans.time) }}</text>
                    </template>
                  </tranBillVue>
                </view>
              </scroll-view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 交易记录列表页面 billAll.vue
 * 功能说明：
 * - 支持按"全部/收入/支出"筛选交易记录
 * - 使用 Swiper + ScrollView 实现 Tab 内容联动
 * - 显示总收入、总支出、交易笔数统计信息
 * - 点击交易项跳转至交易详情页
 * - 日期选择器预留（可扩展为按月/日过滤交易数据）
 */

// 导入Vue相关API
import { ref, reactive, computed, onMounted } from 'vue' // Vue响应式API

// 导入工具函数和组件
import { formatTime } from '@/untils/index.js' // 时间格式化工具
import tranBillVue from '@/components/tranBill/tranBill.vue' // 交易账单组件
import iconsVue from '@/components/icons/icons.vue' // 图标组件
import { transactions } from '@/MXJZdata/indexData.js' // 模拟交易数据
import { transactionStore } from '@/stores/transaction' // 交易状态管理

// ===== 响应式状态管理 =====

/**
 * 当前激活的筛选类型（all / income / expense）
 * @type {Ref<string>}
 */
const activeFilter = ref('all')

/**
 * 日期选择器绑定值（格式：YYYY-MM）
 * @type {Ref<string>}
 */
const selectedDate = ref('')

/**
 * 当前 Swiper 的索引（用于同步 Tab 激活状态）
 * @type {Ref<number>}
 */
const currentTabIndex = ref(0)

/**
 * Pinia Store 实例（用于传递交易详情数据）
 * @type {Object}
 */
const useTransactionStore = transactionStore()

/**
 * Tab 配置（统一管理标签内容）
 * @type {Ref<Array<{label: string, type: string}>>}
 */
const tabs = ref([
  { label: '全部', type: 'all' },
  { label: '支出', type: 'expense' },
  { label: '收入', type: 'income' }
])

/**
 * 统计数据（总收入、总支出）
 * @type {Object}
 */
const stats = reactive({
  totalIncome: 0,
  totalExpense: 0
})

// ===== 计算属性 =====

/**
 * 根据 activeFilter 过滤交易记录（用于顶部统计和空状态判断）
 * @returns {Array} 过滤后的交易数组
 */
const filteredTransactions = computed(() => {
  if (activeFilter.value === 'all') return transactions
  return transactions.filter((t) => t.type === activeFilter.value)
})

// ===== 方法定义 =====

/**
 * 根据类型获取交易列表（供 Swiper 内容使用）
 * @param {string} type - 交易类型（all/income/expense）
 * @returns {Array} 指定类型的交易数组
 */
const getTransactionsByType = (type) => {
  if (type === 'all') return transactions
  return transactions.filter((t) => t.type === type)
}

/**
 * 格式化金额为带 ¥ 符号的字符串（保留两位小数）
 * @param {number} amount - 金额数值
 * @returns {string} 格式化后的金额字符串
 */
const formatCurrency = (amount) => {
  return (
    '¥' +
    amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  )
}

/**
 * 点击顶部 Tab 按钮的处理函数
 * @param {string} type - 选中的交易类型
 */
const handleTabClick = (type) => {
  activeFilter.value = type
  const index = tabs.value.findIndex((tab) => tab.type === type)
  if (index !== -1) currentTabIndex.value = index
}

/**
 * Swiper 滑动时同步 activeFilter 和索引
 * @param {Object} e - 滑动事件对象
 */
const handleSwiperChange = (e) => {
  const index = e.detail.current
  currentTabIndex.value = index
  activeFilter.value = tabs.value[index].type
}

/**
 * 日期选择器变更处理函数（当前仅打印日志，未实现实际过滤）
 * @param {Object} e - 日期变更事件对象
 */
const handleDateChange = () => {
  console.log('选择日期:', selectedDate.value)
  // TODO: 可扩展为按月/日过滤交易数据
}

/**
 * 滚动到底部处理函数（用于分页加载，当前仅占位）
 */
const handleScrollToLower = () => {
  console.log('触底，可加载更多数据')
}

/**
 * 跳转到交易详情页，并通过 Store 传递交易数据
 * @param {Object} trans - 交易对象数据
 */
const navigateToDetail = (trans) => {
  useTransactionStore.setTransaction(trans)
  uni.navigateTo({
    url: '/subPages/TransactionDetail/TransactionDetail'
  })
}

// ===== 生命周期钩子 =====

/**
 * 页面加载时初始化统计数据和默认日期
 */
onMounted(() => {
  stats.totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  stats.totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const now = new Date()
  selectedDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})
</script>

<style lang="scss" scoped>
.transactions-page {
  background-color: $gray-50;
  color: $gray-800;
  min-height: 100vh;
}

.transactions-container {
  padding: $spacing-page;
}

.filter-section {
  margin-bottom: $spacing-4;
  padding: 24rpx;
  background-color: $white;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.date-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;

  .month-box {
    display: flex;
    align-items: center;
    column-gap: 20rpx;
    border-bottom: 2rpx solid #3b82f6;
    padding-bottom: 10rpx;
  }
}

.filter-tabs {
  display: flex;
  background-color: $gray-100;
  border-radius: 50rpx;
  padding: $spacing-1;
}

.filter-tab {
  flex: 1;
  border: none;
  background: none;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: $gray-500;
  transition: all 0.3s ease;

  &.active {
    background-color: $white;
    color: $primary-color;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  }

  &::after {
    border: none;
  }
}

.stats-summary {
  display: flex;
  justify-content: space-between;

  .stat-item {
    text-align: center;
    flex: 1;
  }

  .stat-label {
    font-size: $text-xs;
    color: $gray-500;
    margin-bottom: $spacing-1;
    display: block;
  }

  .stat-value {
    font-size: $text-base;
    font-weight: 600;

    &.income {
      color: $success-color;
    }

    &.expense {
      color: $danger-color;
    }
  }
}

.transactions-list {
  .transactions-group {
    height: 1000rpx;

    .swiper,
    .item,
    .bill {
      height: 100%;
    }

    .bill-box {
      padding: 0 20rpx;
      background-color: $white;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
      margin-bottom: 40rpx;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-6;
  text-align: center;

  .iconfont {
    font-size: 80rpx;
    color: $gray-300;
    margin-bottom: $spacing-4;
  }

  .empty-title {
    font-size: $text-lg;
    color: $gray-500;
    margin-bottom: $spacing-2;
  }

  .empty-desc {
    font-size: $text-sm;
    color: $gray-400;
  }
}

.card {
  background-color: $white;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}
</style>
