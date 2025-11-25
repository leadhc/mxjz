<template>
  <!-- 页面主容器 -->
  <view class="page-container">
    <!-- 账单编辑卡片 -->
    <view class="edit-card" v-if="useTransactionStore.transaction">
      <!-- 金额输入区域 -->
      <view class="input-section">
        <view class="input-label">
          <text class="text">修改金额</text>
        </view>
        <view
          class="amount-input-container"
          :style="{ borderColor: focusStyle }"
        >
          <searchVue
            :isInput="true"
            placeholder="0.00"
            size="50"
            @lfocus="parentFocus"
            @lblur="parentBlur"
            v-model="amountModel"
          >
            <template v-slot:header>
              <iconVue iconUcode="e60f" iconColor="#6366f1" iconSize="26" />
            </template>
          </searchVue>
        </view>
      </view>

      <!-- 分类选择区域 -->
      <view class="input-section">
        <view class="input-label">
          <text class="text">修改分类</text>
        </view>
        <classifyCardVue
          :id="selectedCategory"
          :type="amountType"
          @newItem="parentItem"
        />
      </view>

      <!-- 日期选择区域 -->
      <view class="input-section">
        <view class="input-label">
          <text class="text">修改日期</text>
        </view>
        <view class="time-box">
          <uni-datetime-picker
            class="time"
            type="date"
            v-model="dateTimeSingle"
            return-type="date"
          />
        </view>
      </view>

      <!-- 备注区域 -->
      <view class="input-section">
        <view class="input-label">
          <text class="text">修改备注</text>
          <button
            class="btn"
            size="mini"
            :loading="locationLoading"
            :disabled="locationLoading"
            @click="handerLocation"
          >
            添加位置
          </button>
        </view>
        <view class="note-container">
          <textarea
            class="note-textarea"
            v-model="billNote"
            placeholder="请输入备注..."
            maxlength="500"
            cursor-spacing="35"
            show-confirm-bar="{{false}}"
          />
        </view>
      </view>

      <!-- 底部固定保存按钮 -->
      <view class="bottom-actions">
        <button
          class="save-btn"
          size="default"
          @click="saveBill"
          :loading="saveLoading"
          :disabled="saveLoading"
        >
          <text>保存</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 账单编辑页面 editBill.vue
 * 功能说明：
 * - 编辑现有交易记录的金额、分类、日期和备注信息
 * - 支持添加当前位置信息到备注中
 * - 表单验证（金额、分类、时间等必填项）
 * - 保存修改并返回上一页
 */

// 导入Vue相关API
import { ref } from 'vue'

// 导入组件
import searchVue from '@/components/search/search.vue'
import iconVue from '@/components/icons/icons.vue'
import classifyCardVue from '@/components/classifyCard/classifyCard.vue'

// 导入工具函数
import { showToast, getUserLocation } from '@/untils/index.js'
import { transactionStore } from '@/stores/transaction.js'

// ===== 响应式状态管理 =====

const useTransactionStore = transactionStore()

const amountModel = ref(
  (useTransactionStore.transaction.amount || '').toString()
)
const dateTimeSingle = ref(useTransactionStore.transaction.time || '')
const billNote = ref(useTransactionStore.transaction.note || '')
const selectedCategory = ref(useTransactionStore.transaction.categoryId || 1)
const amountType = ref(useTransactionStore.transaction.type || '')

const focusStyle = ref('#e2e8f0')
const locationLoading = ref(false)
const saveLoading = ref(false)

// 高德地图 API Key（用于获取位置）
const mapKey = ref('')

// ===== 方法定义 =====

const parentFocus = () => {
  focusStyle.value = '#6366f1'
}

const parentBlur = () => {
  focusStyle.value = '#e2e8f0'
}

const parentItem = (val) => {
  selectedCategory.value = val.id
}

const handerLocation = () => {
  locationLoading.value = true

  getUserLocation(mapKey.value)
    .then((res) => {
      const locationName = res[0]?.name || '未知位置'
      if (billNote.value) {
        billNote.value += `\n${locationName}\n`
      } else {
        billNote.value = `${locationName}\n`
      }
      locationLoading.value = false
    })
    .catch(() => {
      locationLoading.value = false
      showToast('获取位置失败', 'error')
    })
}

const saveBill = () => {
  saveLoading.value = true

  const amount = parseFloat(amountModel.value)
  if (isNaN(amount) || amount <= 0) {
    showToast('请输入有效的金额', 'error')
    return
  }

  if (!selectedCategory.value) {
    showToast('请选择分类', 'error')
    return
  }

  if (!dateTimeSingle.value) {
    showToast('请选择时间', 'error')
    return
  }

  useTransactionStore.setTransaction({
    ...useTransactionStore.transaction,
    amount,
    categoryId: selectedCategory.value,
    time: dateTimeSingle.value,
    note: billNote.value
  })

  setTimeout(() => {
    saveLoading.value = false
  }, 1000)

  showToast('保存成功', 'success')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding: $spacing-page;
  background-color: #f8fafc;
  color: #1e293b;
  padding-bottom: 100rpx;

  .edit-card {
    background: $white;
    border-radius: 26rpx;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 20rpx;
    box-sizing: border-box;
  }

  .input-section {
    margin-bottom: 60rpx;

    .input-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .text {
        font-size: $text-base;
        font-weight: 500;
        color: $gray-500;
      }

      .btn {
        margin: 0rpx;
        padding: 0rpx 20rpx;
        border: none;
        background: #6366f1;
        border-radius: 12rpx;
        margin-right: 10rpx;

        &::after {
          padding: 0rpx;
          border: none;
          margin: 0rpx;
        }
      }
    }

    .time-box {
      height: 88rpx;

      .time {
        height: 100%;
      }
    }
  }

  .amount-input-container {
    height: 82rpx;
    border-bottom: 4rpx solid $gray-200;
    box-sizing: border-box;
  }
}

.note-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

  .note-textarea {
    min-height: 120px;
    padding: 12px;
    width: 100%;
    font-size: 16px;
  }
}

.bottom-actions {
  .save-btn {
    padding: 0rpx;
    margin: 0rpx;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #6366f1;
    color: white;
    border-radius: 8px;
    width: 100%;
    font-weight: 500;

    &::after {
      padding: 0rpx;
      margin: 0rpx;
      border: none;
    }
  }
}
</style>
