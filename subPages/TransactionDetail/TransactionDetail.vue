<template>
  <!-- 交易详情页面主容器：整个页面的根容器，设置页面级别的样式和布局 -->
  <view class="transaction-detail">
    <!-- 头部信息区域：图标 + 标题 + 金额，仅当存在交易数据时显示 -->
    <view class="header" v-if="useTransactionStore.transaction">
      <!-- 图标显示：根据交易类型显示不同颜色和样式的图标 -->
      <view class="img-box">
        <iconsVue
          :iconType="useTransactionStore.transaction.type"
          :iconUcode="useTransactionStore.transaction.icon"
          :iconColor="useTransactionStore.transaction.iconColor"
        />
      </view>

      <!-- 交易标题：显示交易的具体标题或分类名称 -->
      <view class="title-box">
        <text class="title">{{ useTransactionStore.transaction.title }}</text>
      </view>

      <!-- 金额显示（支出为负，收入为正） -->
      <view class="amount">
        <text
          class="amount-text"
          :style="{
            color:
              useTransactionStore.transaction.type === 'expense'
                ? '#ef4444'
                : '#10b981'
          }"
        >
          <!-- 根据交易类型显示不同的符号（支出为负，收入为正） -->
          {{
            useTransactionStore.transaction.type === 'expense' ? '-' : '+'
          }}¥{{ useTransactionStore.transaction.amount }}
        </text>
      </view>
    </view>

    <!-- 信息卡片：显示交易的基本信息（分类、时间、编号） -->
    <view class="info-card">
      <!-- 分类信息：显示交易所属的具体分类 -->
      <view class="info-item">
        <text class="label">分类</text>
        <text class="value">{{
          useTransactionStore.transaction.category
        }}</text>
      </view>
      <!-- 交易时间：显示交易发生的具体时间，使用formatTime函数格式化 -->
      <view class="info-item">
        <text class="label">交易时间</text>
        <text class="value">{{
          formatTime(useTransactionStore.transaction.time, 2)
        }}</text>
      </view>
      <!-- 记账编号：显示交易的唯一标识符 -->
      <view class="info-item">
        <text class="label">记账编号</text>
        <text class="value">37265465688909</text>
        <!-- 可替换为真实 ID：在实际项目中应使用真实的交易ID -->
      </view>
    </view>

    <!-- 备注区域：显示用户为该交易添加的备注信息 -->
    <view class="remark-card">
      <view class="remark-label">备注</view>
      <text class="remark-content">{{
        useTransactionStore.transaction.note
      }}</text>
    </view>

    <!-- 操作按钮区域：提供编辑和删除功能 -->
    <view class="action-buttons">
      <!-- 编辑按钮：跳转到编辑账单页面 -->
      <button class="btn edit-btn" @click="handleEdit">
        <text class="btn-text">编辑</text>
      </button>
      <!-- 删除按钮：删除当前交易记录（带确认提示） -->
      <button class="btn delete-btn" @click="handleDelete">
        <text class="btn-text">删除</text>
      </button>
    </view>
  </view>
</template>

<script setup>
/**
 * 交易详情页面 TransactionDetail.vue
 * 功能：
 * - 展示单笔交易的详细信息（标题、金额、分类、时间、备注等）
 * - 提供"编辑"和"删除"操作入口
 * - 删除前弹出确认模态框，防止误操作
 * - 根据交易类型（支出/收入）动态调整显示样式（颜色、符号等）
 */

// 导入必要的组件和工具
import { transactionStore } from '@/stores/transaction.js' // 交易记录状态管理：用于获取和管理交易数据
import { formatTime } from '@/untils/index.js' // 时间格式化工具函数：用于将时间戳转换为易读的时间格式
import iconsVue from '@/components/icons/icons.vue' // 图标组件：用于根据交易类型显示对应的图标

// 获取 Pinia Store 实例（用于读取当前交易详情）
const useTransactionStore = transactionStore()

/**
 * 跳转到编辑账单页面
 * 当用户点击"编辑"按钮时触发，使用uni.navigateTo进行页面跳转
 *
 * @returns {void}
 */
const handleEdit = () => {
  uni.navigateTo({
    url: '/subPages/editBill/editBill' // 目标页面路径：账单编辑页面
  })
}

/**
 * 删除当前账单（带二次确认）
 * 当用户点击"删除"按钮时触发，显示确认对话框，防止误操作
 *
 * @returns {void}
 */
const handleDelete = () => {
  // 显示确认对话框：使用uni.showModal显示操作确认框
  uni.showModal({
    title: '删除账单', // 对话框标题：明确指示操作目的
    content: '您确定要删除该账单吗？删除后将无法恢复。', // 对话框内容：说明操作后果，提醒用户
    success: (res) => {
      // 用户点击确认按钮
      if (res.confirm) {
        // TODO: 调用删除接口或从 store 中移除数据（实际项目中应实现）
        console.log('用户点击了"确定"，执行删除逻辑')
        // 示例：useTransactionStore.removeTransaction()

        // 删除后返回上一页：使用uni.navigateBack返回上一个页面
        uni.navigateBack()
      }
      // 若用户点击取消，不做任何操作
    },
    complete: () => {
      // 无论用户点击确认还是取消，都会执行的回调函数
      console.log('模态框关闭')
    }
  })
}
</script>

<style lang="scss" scoped>
/**
 * 交易详情页面样式定义
 * 样式结构：
 * - 主容器样式：页面整体布局和背景设置
 * - 头部样式：图标、标题和金额的布局和样式
 * - 信息卡片样式：交易基本信息（分类、时间、编号）的展示样式
 * - 备注区域样式：交易备注内容的展示样式
 * - 操作按钮样式：编辑和删除按钮的样式定义
 */

// 主容器样式：设置页面的整体布局和背景
.transaction-detail {
  padding: $spacing-page; // 页面内边距：使用变量统一管理，确保一致性
  background: #fff; // 背景色：白色，确保内容清晰可见
  border-radius: 16px; // 圆角边框：提升视觉体验，使界面更加柔和
  margin-bottom: 20px; // 底部外边距：与其他内容区域分隔

  // 头部样式：包含图标、标题和金额的布局
  .header {
    display: flex; // 弹性布局：便于灵活对齐和排列元素
    flex-direction: column; // 垂直排列：图标在上，标题居中，金额在下
    align-items: center; // 水平居中：所有元素在水平方向居中对齐
    margin-bottom: 40rpx; // 底部外边距：与下方信息卡片分隔

    // 图标容器：设置图标的布局和边距
    .img-box {
      margin-bottom: 20rpx; // 图标底部边距：与下方标题分隔
    }

    // 标题容器：设置标题的样式
    .title-box .title {
      font-weight: 500; // 标题字重：使用中等粗细，突出但不过于突兀
      font-size: $text-sm; // 标题字体大小：使用变量统一管理
      color: $gray-700; // 标题颜色：中灰色，确保良好的可读性
    }

    // 金额显示区域：设置金额的布局和样式
    .amount {
      text-align: center; // 金额居中显示：确保金额在视觉上突出
      margin: 20rpx 0; // 上下边距：与标题和下方内容分隔

      // 金额文本样式：使用较大字号和粗体突出显示金额
      .amount-text {
        font-size: $text-2xl; // 金额字体大小：使用较大字号，突出显示
        font-weight: 700; // 金额字重：使用粗体，增强视觉效果
      }
    }
  }

  // 信息卡片样式：交易基本信息（分类、时间、编号）的展示样式
  .info-card {
    background-color: #ffffff; // 卡片背景色：白色，突出显示信息
    border-radius: 12px; // 卡片圆角：提升视觉体验
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 卡片阴影：增加层次感，使卡片浮于背景之上
    padding: $spacing-2; // 卡片内边距：使用变量统一管理
    margin-bottom: 40rpx; // 底部边距：与下方备注区域分隔

    // 信息项样式：设置每个信息项的布局和样式
    .info-item {
      display: flex; // 弹性布局：便于对齐标签和值
      justify-content: space-between; // 两端对齐：标签在左，值在右
      padding: 30rpx 0; // 上下内边距：增加元素高度，提高可读性
      border-bottom: 1rpx solid $gray-100; // 分割线：分隔信息项，增强视觉层次

      // 最后一项没有分割线：避免在列表末尾出现多余的分割线
      &:last-child {
        border-bottom: none; // 移除最后一项的分割线
      }

      // 标签样式：设置标签的字体大小和颜色
      .label {
        color: $gray-500; // 标签颜色：浅灰色，作为辅助信息
        font-size: $text-sm; // 标签字体大小：使用较小字号
      }

      // 值的样式：设置值的字体大小和颜色
      .value {
        color: $gray-800; // 值的颜色：深灰色，确保良好的可读性
        font-size: $text-base; // 值的字体大小：使用中等字号
      }
    }
  }

  // 备注区域样式：交易备注内容的展示样式
  .remark-card {
    background-color: $white; // 备注背景色：白色，突出显示备注内容
    padding: 20rpx; // 备注内边距：增加内容与边框的距离
    margin-bottom: 40rpx; // 底部边距：与下方操作按钮区域分隔
    border-radius: 24rpx; // 备注圆角：与整体设计风格保持一致
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 备注阴影：增加层次感

    // 备注标签样式：设置备注标签的样式
    .remark-label {
      font-size: $text-lg; // 备注标签字体大小：使用较大字号，突出显示
      color: $gray-800; // 备注标签颜色：深灰色，确保良好的可读性
      margin-bottom: 30rpx; // 底部边距：与备注内容分隔
      display: block; // 确保是块级元素，方便设置边距
    }

    // 备注内容样式：设置备注内容的样式
    .remark-content {
      color: $gray-600; // 备注内容颜色：中灰色，区分于标题和重要信息
      font-size: $text-base; // 备注内容字体大小：使用中等字号
      line-height: 1.5; // 行高：增加行间距，提升阅读体验
    }
  }

  // 操作按钮样式：编辑和删除按钮的样式定义
  .action-buttons {
    display: flex; // 弹性布局：便于排列按钮
    justify-content: space-around; // 按钮均匀分布：两个按钮对称排列

    // 按钮基础样式：设置按钮的通用样式
    .btn {
      width: 200rpx; // 按钮宽度：固定宽度，确保按钮大小一致
      height: 80rpx; // 按钮高度：固定高度，确保按钮大小一致
      border-radius: 16rpx; // 按钮圆角：提升视觉体验
      font-size: $text-base; // 按钮字体大小：使用中等字号
      display: flex; // 弹性布局：用于内容居中
      align-items: center; // 按钮内容垂直居中：确保文字在按钮中垂直居中
      justify-content: center; // 按钮内容水平居中：确保文字在按钮中水平居中
      border: none; // 无边框：移除默认边框，使用自定义样式
      margin: 0; // 无外边距：避免额外的间距
      padding: 0 20rpx; // 左右内边距：确保文字与按钮边缘有适当距离

      &::after {
        border: none; // 移除小程序 button 默认边框：避免默认样式影响
      }
    }

    // 编辑按钮样式（次要操作）：使用灰色背景，区分于主要操作
    .edit-btn {
      background: $gray-100; // 灰色背景：表示次要操作
      color: $gray-500; // 灰色文字：与背景色形成对比
    }

    // 删除按钮样式（危险操作）：使用红色背景，突出显示危险操作
    .delete-btn {
      background: $danger-color; // 红色背景：表示危险操作
      color: $white; // 白色文字：与红色背景形成强烈对比，提高可读性
    }
  }
}
</style>
