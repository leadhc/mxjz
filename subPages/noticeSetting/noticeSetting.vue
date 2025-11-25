<template>
  <!-- 通知设置页面主容器 -->
  <view class="notification-settings-page">
    <view class="page-container">
      <!-- 通知总开关 -->
      <view class="global-settings card">
        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e605"
                iconColor="#3b82f6"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="推送通知"
                desc="接收应用推送消息"
                color="#3b82f6"
                :type="NOTIFY.PUSH"
                :checked="rawSettings[NOTIFY.PUSH]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 记账相关通知 -->
      <view class="accounting-notifications card">
        <text class="section-title">记账相关</text>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e749"
                iconColor="#f59e0b"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="记账提醒"
                desc="每日提醒记账"
                color="#10b981"
                :type="NOTIFY.ACCT"
                :checked="rawSettings[NOTIFY.ACCT]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e754"
                iconColor="#a855f7"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="月度报告"
                desc="每月发送消费报告"
                color="#3b82f6"
                :type="NOTIFY.REPORT"
                :checked="rawSettings[NOTIFY.REPORT]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e602"
                iconColor="#ef4444"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="预算提醒"
                desc="预算即将用完时提醒"
                color="#ef4444"
                :type="NOTIFY.BUDGET"
                :checked="rawSettings[NOTIFY.BUDGET]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 社区通知 -->
      <view class="community-notifications card">
        <text class="section-title">社区互动</text>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="27"
                iconUcode="e650"
                iconColor="#eab308"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="社区消息"
                desc="接收论坛互动消息"
                color="#f59e0b"
                :type="NOTIFY.COMMUNITY"
                :checked="rawSettings[NOTIFY.COMMUNITY]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e67d"
                iconColor="#327bf3ab"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="点赞通知"
                desc="有人点赞你的帖子或评论"
                color="#3b82f6"
                :type="NOTIFY.LIKE"
                :checked="rawSettings[NOTIFY.LIKE]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e60e"
                iconColor="#10b981"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="评论通知"
                desc="有人评论你的帖子"
                color="#10b981"
                :type="NOTIFY.COMMENT"
                :checked="rawSettings[NOTIFY.COMMENT]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 提醒时间设置 -->
      <view class="reminder-settings card">
        <text class="section-title">提醒时间</text>

        <view class="setting-item" @click="setReminderTime">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e7a2"
                iconColor="#f59e0b"
              />
            </view>
            <view class="item-box">
              <view class="setting-details">
                <text class="setting-title">记账提醒时间</text>
                <text class="setting-desc">{{
                  rawSettings[NOTIFY.ACCT_TIME]
                }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="setting-item" @click="setReminderMonth">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e6f8"
                iconColor="#3b82f6"
              />
            </view>
            <view class="item-box">
              <view class="setting-details">
                <text class="setting-title">月度报告时间</text>
                <text class="setting-desc"
                  >每月1日 {{ rawSettings[NOTIFY.REPORT_TIME] }}</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 勿扰模式 -->
      <view class="dnd-settings card">
        <text class="section-title">勿扰模式</text>

        <view class="setting-item">
          <view class="setting-info">
            <view>
              <icons-vue
                iconType="''"
                iconSize="26"
                iconUcode="e663"
                iconColor="#ef4444"
              />
            </view>
            <view class="item-box">
              <noticeItemVue
                title="开启勿扰模式"
                desc="在指定时间段内不接收通知"
                color="#ef4444"
                :type="NOTIFY.DND"
                :checked="rawSettings[NOTIFY.DND]"
                @confirmSwitch="switchChange"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 确认弹窗 -->
    <dialogVue
      v-model="dialogShow"
      :title="dialogTitle"
      @Lconfirm="dialogConfirm"
      @Lclose="dialogClose"
    >
      <template #default>
        <view>
          <text>{{ dialogDesc }}</text>
        </view>
      </template>
    </dialogVue>
  </view>
</template>

<script setup>
/**
 * 通知设置页面 noticeSetting.vue
 * 功能：
 * - 管理应用各类通知的开关状态
 * - 支持设置提醒时间（记账提醒、月度报告）
 * - 提供勿扰模式功能
 * - 智能的开关逻辑（某些开关需要确认弹窗）
 * - 根据开关状态动态控制UI显示
 */
import { ref, computed, onMounted } from 'vue'
import iconsVue from '@/components/icons/icons.vue' // 图标组件
import noticeItemVue from '@/components/noticeItem/nnoticeItem.vue' // 通知项组件
import dialogVue from '@/components/dialog/dialog.vue' // 弹窗组件
import { NOTIFY } from '@/constant/index.js' // 通知类型常量定义
import { showToast } from '@/untils/index.js' // 提示框工具函数

/**
 * 通知设置数据源
 * - 布尔值：控制各类通知开关
 * - 字符串：控制提醒时间（不参与开关逻辑）
 */
const rawSettings = ref({
  [NOTIFY.PUSH]: true, // 推送通知总开关
  [NOTIFY.ACCT]: true, // 记账提醒开关
  [NOTIFY.REPORT]: true, // 月度报告开关
  [NOTIFY.BUDGET]: true, // 预算提醒开关
  [NOTIFY.COMMUNITY]: true, // 社区消息开关
  [NOTIFY.LIKE]: true, // 点赞通知开关
  [NOTIFY.COMMENT]: true, // 评论通知开关
  [NOTIFY.DND]: false, // 勿扰模式开关

  [NOTIFY.ACCT_TIME]: '21:00', // 记账提醒时间
  [NOTIFY.REPORT_TIME]: '9:00' // 月度报告时间
})

// 弹窗相关状态
const pendingChange = ref(null) // 待确认的开关变更对象（包含type和newValue）
const dialogShow = ref(false) // 是否显示确认弹窗

/**
 * 弹窗标题：根据待变更类型动态生成
 * @returns {string} 弹窗标题文本
 */
const dialogTitle = computed(() => {
  if (!pendingChange.value) return ''
  const titles = {
    [NOTIFY.PUSH]: '推送通知',
    [NOTIFY.ACCT]: '记账提醒',
    [NOTIFY.REPORT]: '月度报告',
    [NOTIFY.BUDGET]: '预算提醒',
    [NOTIFY.COMMUNITY]: '社区消息',
    [NOTIFY.LIKE]: '点赞通知',
    [NOTIFY.COMMENT]: '评论通知',
    [NOTIFY.DND]: '勿扰模式'
  }
  return `${titles[pendingChange.value.type] || '通知'}设置`
})

/**
 * 弹窗描述文案：根据待变更类型动态生成
 * @returns {string} 弹窗描述文本
 */
const dialogDesc = computed(() => {
  if (!pendingChange.value) return ''
  const descs = {
    [NOTIFY.PUSH]:
      '是否确定更改推送通知设置？这将影响您接收所有应用内消息的能力。',
    [NOTIFY.ACCT]: '是否确定开启或关闭每日记账提醒？',
    [NOTIFY.REPORT]: '是否确定更改月度消费报告的通知设置？',
    [NOTIFY.BUDGET]: '是否确定更改预算提醒？当支出接近预算上限时将发送通知。',
    [NOTIFY.COMMUNITY]: '是否确定更改社区互动消息的接收设置？',
    [NOTIFY.LIKE]:
      '是否确定更改点赞通知？有人点赞您的内容时将不再提醒（或重新提醒）。',
    [NOTIFY.COMMENT]:
      '是否确定更改评论通知？有人回复您时将不再收到提醒（或重新启用）。',
    [NOTIFY.DND]: '是否确定开启勿扰模式？开启后，在设定时段内将不接收任何通知。'
  }
  return descs[pendingChange.value.type] || '是否确定要更改此通知设置？'
})

/**
 * 开关变更处理函数
 * 处理不同类型通知开关的逻辑分支：
 * - 开启勿扰模式：需弹窗确认
 * - 关闭勿扰模式：直接生效
 * - 开启推送总开关：直接生效
 * - 开启其他通知：直接生效
 * - 关闭其他通知：弹窗确认
 * @param {Object} obj - 包含type和newValue的变更对象
 */
const switchChange = (obj) => {
  const { type, newValue } = obj

  // 开启勿扰模式：需弹窗确认
  if (type === NOTIFY.DND && newValue) {
    pendingChange.value = obj
    dialogShow.value = true
    return
  }

  // 关闭勿扰模式：直接生效，无需确认
  if (type === NOTIFY.DND && !newValue) {
    setSwitch(obj)
    return
  }

  // 推送总开关开启：直接生效（不影响勿扰）
  if (type === NOTIFY.PUSH && newValue) {
    setSwitch(obj)
    return
  }

  // 其他通知开启：直接生效
  if (newValue) {
    setSwitch(obj)
    return
  }

  // 其他通知关闭：弹窗确认
  pendingChange.value = obj
  dialogShow.value = true
}

/**
 * 弹窗确认回调：执行实际开关变更
 */
const dialogConfirm = () => {
  dialogShow.value = false
  setSwitch(pendingChange.value)
}

/**
 * 弹窗取消回调：仅关闭弹窗，UI由子组件自动回滚
 */
const dialogClose = () => {
  dialogShow.value = false
}

/**
 * 执行开关状态更新
 * - PUSH开关会同步影响所有非DND的布尔型通知
 * - DND开关独立控制
 * - 其他开关只影响自身状态
 * @param {Object} obj - 包含type和newValue的变更对象
 */
function setSwitch(obj) {
  if (obj.type === NOTIFY.PUSH) {
    // 同步更新所有普通通知（勿扰模式除外）
    for (const key in rawSettings.value) {
      if (typeof rawSettings.value[key] === 'boolean' && key !== NOTIFY.DND) {
        rawSettings.value[key] = obj.newValue
      }
    }
  } else {
    // 单独更新某类通知或勿扰模式
    rawSettings.value[obj.type] = obj.newValue
  }
}

/**
 * 设置记账提醒时间
 * - 若通知未开启，提示用户先开启
 * - 显示时间选择器供用户选择
 */
const setReminderTime = () => {
  if (!rawSettings.value[NOTIFY.ACCT]) {
    showToast('请开启相应的通知', 'error')
    return
  }
  uni.showActionSheet({
    itemList: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    success: (res) => {
      const times = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
      rawSettings.value[NOTIFY.ACCT_TIME] = times[res.tapIndex]
    }
  })
}

/**
 * 设置月度报告时间
 * - 若通知未开启，提示用户先开启
 * - 显示时间选择器供用户选择
 */
const setReminderMonth = () => {
  if (!rawSettings.value[NOTIFY.REPORT]) {
    showToast('请开启相应的通知', 'error')
    return
  }
  uni.showActionSheet({
    itemList: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'],
    success: (res) => {
      const times = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00']
      rawSettings.value[NOTIFY.REPORT_TIME] = times[res.tapIndex]
    }
  })
}

/**
 * 页面加载完成钩子（可用于加载持久化设置）
 */
onMounted(() => {
  // 可在此加载本地存储的设置
})
</script>

<style lang="scss" scoped>
/**
 * 通知设置页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景设置
 * - 容器样式：页面内容容器和卡片样式
 * - 设置项样式：各个通知设置项的布局和样式
 * - 标题样式：区域标题和设置项标题样式
 * - 交互元素样式：按钮、开关等交互组件样式
 */

// 页面基础样式
.notification-settings-page {
  background-color: $gray-50; // 页面背景色，使用浅灰色增强可读性
  color: $gray-800; // 页面文字颜色
  min-height: 100vh; // 最小高度占满整个视口
}

// 页面容器样式
.page-container {
  padding: $spacing-page; // 页面内边距
}

// 卡片基础样式
.card {
  background-color: $white; // 卡片背景色
  border-radius: 24rpx; // 卡片圆角
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 卡片阴影，增强层次感
  margin-bottom: $spacing-4; // 卡片间距
  padding: $spacing-page; // 卡片内边距
}

// 区域标题样式
.section-title {
  font-size: $text-lg; // 字体大小
  font-weight: 500; // 字体粗细
  color: $gray-700; // 文本颜色
  margin-bottom: $spacing-4; // 底部外边距
  display: block; // 确保是块级元素，方便设置边距
}

// 设置项样式
.setting-item {
  display: flex;
  justify-content: space-between; // 两端对齐布局
  align-items: center; // 垂直居中对齐
  padding: 20rpx 0; // 上下内边距
  border-bottom: 2rpx solid $gray-100; // 下划线，区分不同设置项

  &:last-child {
    border-bottom: none; // 最后一项无边框，避免底部出现多余分隔线
  }
}

// 设置项信息样式
.setting-info {
  display: flex;
  align-items: center; // 垂直居中对齐
  flex: 1; // 占满剩余空间

  .item-box {
    flex: 1; // 占满剩余空间
    margin-left: 20rpx; // 左侧间距，与图标保持适当距离
  }
}

// 设置详情样式（用于时间设置等非开关类型的设置项）
.setting-details {
  .setting-title {
    font-size: $text-base; // 标题字体大小
    color: $gray-800; // 标题文本颜色
    margin-bottom: $spacing-1; // 底部外边距
    display: block; // 确保是块级元素，方便设置边距
  }

  .setting-desc {
    font-size: $text-sm; // 描述字体大小
    color: $gray-500; // 描述文本颜色
    display: block; // 确保是块级元素，方便设置边距
  }
}
</style>
