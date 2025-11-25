<!--
 * 记账页面组件 account.vue
 * 功能：用于记录用户的收支情况
 * 
 * 主要功能模块：
 * 1. 记账类型切换（支出/收入）
 * 2. 金额输入
 * 3. 分类选择（根据当前记账类型显示不同分类）
 * 4. 日期选择
 * 5. 位置添加
 * 6. 备注输入
 * 7. 记录保存
 -->

<template>
  <!-- 记账页面 -->
  <view class="record-page">
    <view class="record-container">
      <!-- 顶部导航：支出/收入切换 -->
      <view class="record-header">
        <view class="type-tabs">
          <view
            class="tab-button"
            :class="{ active: activeTab === 'expense' }"
            @click="switchTab('expense')"
          >
            支出
          </view>
          <view
            class="tab-button"
            :class="{ active: activeTab === 'income' }"
            @click="switchTab('income')"
          >
            收入
          </view>
        </view>
      </view>

      <!-- 金额输入区域 -->
      <view class="amount-section">
        <searchVue
          v-model="amount"
          :isInput="true"
          align="center"
          :isBorder="false"
          size="40"
          placeholder="0"
        />
      </view>

      <!-- 分类选择区域 -->
      <view class="category-section">
        <text class="section-title">选择分类</text>
        <!-- 分类卡片组件，根据当前记账类型显示不同分类 -->
        <classifyCardVue
          :type="activeTab"
          :id="selectedCategorys"
          @newItem="parentItem"
        />
      </view>

      <!-- 日期和备注区域 -->
      <view class="details-section">
        <view class="detail-row">
          <!-- 日期选择 -->
          <view class="detail-item" @click="showDatePicker = true">
            <text class="iconfont icon-calendar-alt"></text>
            <text class="detail-text">{{ formattedDate }}</text>
          </view>
          <!-- 位置添加 -->
          <view class="detail-item" @click="addLocation">
            <text class="iconfont icon-map-marker-alt"></text>
            <text class="detail-text">添加位置</text>
          </view>
        </view>
        <!-- 备注输入 -->
        <view class="note-input-wrapper">
          <textarea
            class="textarea"
            cursor-color="red"
            v-model="textareaValue"
            placeholder="输入备注"
            maxlength="-1"
            show-confirm-bar="{{ false }}"
          />
        </view>
      </view>

      <!-- 保存按钮 -->
      <button
        class="save-button"
        @click="saveRecord"
        :loading="saveLoading"
        :disabled="saveLoading"
      >
        <text class="save-button-text">保存</text>
      </button>
    </view>
  </view>
</template>

<script setup>
/**
 * 记账页面逻辑脚本
 * 功能包括：
 * - 管理记账类型（支出/收入）切换
 * - 处理金额输入和验证
 * - 处理分类选择
 * - 管理日期和位置信息
 * - 处理备注输入
 * - 保存记账记录
 */

import { ref, computed, onMounted } from 'vue'
import { getUserLocation } from '@/untils/index.js' // 获取用户位置的工具函数
import searchVue from '@/components/search/search.vue' // 自定义搜索/输入组件
import classifyCardVue from '@/components/classifyCard/classifyCard.vue' // 分类卡片组件
import {
  expenseCategoryData, // 支出分类数据
  incomeCategoryData // 收入分类数据
} from '@/MXJZdata/amountCategoryData.js'

// ========== 响应式状态 ==========

// 用户输入的金额
const amount = ref('')

// 当前选中的分类 ID（由子组件 classifyCardVue 回传）
const selectedCategorys = ref('')

// 当前记录的日期（默认为今天）
const date = ref('')

// 当前记账类型：'expense'（支出）或 'income'（收入）
const activeTab = ref('expense')

// 备注内容
const textareaValue = ref('')

// 高德地图 API Key（用于获取位置）
const mapKey = ref('')

// 控制日期选择器显示（当前未实现，保留占位）
const showDatePicker = ref(false)

// 保存按钮加载状态
const saveLoading = ref(false)

// ========== 计算属性 ==========

/**
 * 格式化显示日期（如：5月16日）
 * @returns {string} 格式化后的日期字符串
 */
const formattedDate = computed(() => {
  if (!date.value) {
    const today = new Date()
    return `${today.getMonth() + 1}月${today.getDate()}日`
  }
  const dateObj = new Date(date.value)
  return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
})

// ========== 方法 ==========

/**
 * 切换记账类型（支出/收入）
 * @param {string} tab - 'expense' 或 'income'
 */
const switchTab = (tab) => {
  activeTab.value = tab
}

/**
 * 接收子组件 classifyCardVue 传递的选中分类
 * @param {Object} val - 选中的分类对象
 */
const parentItem = (val) => {
  selectedCategorys.value = val.id
}

/**
 * 获取用户当前位置，并追加到备注中
 * 使用高德地图 API 获取位置信息
 */
const addLocation = () => {
  uni.showLoading({ title: '加载中' })
  getUserLocation(mapKey.value)
    .then((res) => {
      const locationName = res[0]?.name || '未知位置'
      if (textareaValue.value) {
        textareaValue.value += `\n${locationName}\n`
      } else {
        textareaValue.value = `${locationName}\n`
      }
      uni.hideLoading()
    })
    .catch((err) => {
      console.error('获取位置失败:', err)
      uni.hideLoading()
      uni.showToast({ title: '获取位置失败', icon: 'none' })
    })
}

/**
 * 保存记账记录
 * 验证输入数据，显示加载状态，保存成功后重置表单
 */
const saveRecord = () => {
  // 显示加载状态
  saveLoading.value = true

  // 模拟保存延迟
  setTimeout(() => {
    saveLoading.value = false
  }, 1000)

  // 验证金额输入
  const numAmount = parseFloat(amount.value)
  if (!amount.value || isNaN(numAmount) || numAmount <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' })
    return
  }

  // 验证分类选择
  if (!selectedCategorys.value) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }

  // 模拟保存成功
  uni.showToast({ title: '保存成功', icon: 'success' })

  // 重置表单数据
  setTimeout(resetData, 300)
}

/**
 * 重置表单数据（保存后清空）
 */
const resetData = () => {
  amount.value = ''
  textareaValue.value = ''
  selectedCategorys.value = ''
}

// ========== 生命周期 ==========

/**
 * 页面加载时初始化日期为今天
 */
onMounted(() => {
  const today = new Date()
  date.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
})
</script>

<style lang="scss" scoped>
/*
 * 记账页面样式定义
 * 使用 SCSS 预处理器，包含以下主要样式区域：
 * 1. 基础布局样式（页面容器）
 * 2. 顶部导航样式（支出/收入切换标签）
 * 3. 金额输入样式
 * 4. 分类选择样式
 * 5. 详情部分样式（日期、位置、备注）
 * 6. 保存按钮样式
 */

.record-page {
  background-color: $gray-50;
  color: $gray-800;
  min-height: 100vh;
}

.record-container {
  padding: $spacing-2;
  padding-top: 0rpx;
}

/* 顶部导航样式 */
.record-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: $spacing-6;
}

.type-tabs {
  min-height: 80rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: $gray-100;
  padding: $spacing-1;
}

.tab-button {
  width: 150rpx;
  height: 60rpx;
  border: 1px solid #ccc5c5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  font-weight: 500;
  color: $gray-500;
  transition: all 0.3s ease;

  &.active {
    background-color: $white;
    color: $primary-color;
    border: none;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  }
}

/* 金额输入样式 */
.amount-section {
  height: 60rpx;
  margin-bottom: $spacing-6;
  border-bottom: 1px solid #ccc5c5;
}

/* 分类选择样式 */
.category-section {
  margin-bottom: $spacing-6;
}

.section-title {
  color: $gray-500;
  margin-bottom: $spacing-3;
  display: block;
}

/* 详情部分样式 */
.details-section {
  margin-bottom: $spacing-6;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;
}

.detail-item {
  display: flex;
  align-items: center;
  color: $gray-700;
  padding: $spacing-2 0;
}

.detail-text {
  margin-left: $spacing-2;
}

/* 备注输入样式 */
.note-input-wrapper {
  min-height: 200rpx;
  width: 100%;
  position: relative;
  background-color: $white;
  border-radius: 16rpx;
  padding: $spacing-2 $spacing-4;
  border: 2rpx solid $gray-200;
  box-sizing: border-box;

  .textarea {
    display: block;
    height: 200rpx;
    width: inherit;
    padding: 10rpx;
    box-sizing: border-box;
    line-height: 50rpx;
    font-size: $text-base;
  }
}

/* 保存按钮样式 */
.save-button {
  width: 100%;
  background-color: $primary-color;
  color: $white;
  border: none;
  border-radius: 16rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background-color: $primary-dark;
  }

  &:active {
    transform: scale(0.98);
  }
}

.save-button-text {
  font-weight: 500;
}
</style>
