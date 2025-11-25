<template>
  <!-- 个人信息设置页面主容器 -->
  <view class="personal-info-page">
    <view class="page-container">
      <!-- 头像设置区域 -->
      <view class="avatar-section card">
        <text class="section-title">更换头像</text>
        <view class="avatar-content">
          <view class="avatar-wrapper" @click="changeAvatar">
            <image :src="useUserStore.userInfo.avatarUrl" class="user-avatar" />
          </view>
        </view>
      </view>

      <!-- 基本信息区域 -->
      <view class="basic-info card">
        <text class="section-title">基本信息</text>
        <view class="form-list">
          <!-- 昵称输入 -->
          <view class="form-item">
            <text class="form-label">昵称</text>
            <view class="input-box">
              <searchVue
                :isInput="true"
                placeholder="输入昵称"
                v-model="useUserStore.userInfo.nickName"
              ></searchVue>
            </view>
          </view>

          <!-- 性别选择 -->
          <view class="form-item">
            <text class="form-label">性别</text>
            <view class="gender-options">
              <button
                size="mini"
                class="gender-option"
                :class="{ active: useUserStore.userInfo.gender === 0 }"
                @click="useUserStore.userInfo.gender = 0"
              >
                男
              </button>
              <button
                size="mini"
                class="gender-option"
                :class="{
                  active: useUserStore.userInfo.gender === 1
                }"
                @click="useUserStore.userInfo.gender = 1"
              >
                女
              </button>

              <button
                size="mini"
                class="gender-option"
                :class="{
                  active: useUserStore.userInfo.gender === 2
                }"
                @click="useUserStore.userInfo.gender = 2"
              >
                不显示性别
              </button>
            </view>
          </view>

          <!-- 生日选择 -->
          <view class="form-item">
            <text class="form-label">生日</text>
            <picker
              mode="date"
              :value="useUserStore.userInfo.birthday"
              @change="onBirthdayChange"
              class="date-picker"
            >
              <view class="date-display">{{
                useUserStore.userInfo.birthday || '请选择生日'
              }}</view>
            </picker>
          </view>
        </view>
      </view>

      <!-- 联系方式区域 -->
      <view class="contact-info card">
        <text class="section-title">联系方式</text>
        <view class="form-list">
          <!-- 手机号 -->
          <view class="form-item">
            <text class="form-label">手机号</text>
            <view class="contact-content">
              <text class="contact-value">{{
                useUserStore.userInfo.phone
              }}</text>
              <button class="change-button" @click="changePhone">
                {{ useUserStore.userInfo.phone ? '修改手机号' : '绑定手机号' }}
              </button>
            </view>
          </view>

          <!-- 邮箱 -->
          <view class="form-item">
            <text class="form-label">邮箱</text>
            <view class="contact-content">
              <text class="contact-value">{{
                useUserStore.userInfo.email
              }}</text>
              <button class="change-button" @tap="changeEmail">
                {{ useUserStore.userInfo.email ? '修改邮箱' : '绑定邮箱' }}
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="card" @click="saveInfo">
        <button class="saveBtn">保存修改</button>
      </view>
    </view>

    <!-- 对话框组件 -->
    <dialogVue v-model="dialogShow" :title="title" @Lconfirm="dialogConfirm">
      <template #default>
        <view class="dialog-body">
          <!-- 自定义输入组件，用于输入预算金额 -->
          <view class="input-box">
            <searchVue
              :isInput="true"
              :placeholder="title"
              v-model="dialogInput"
            ></searchVue>
          </view>
        </view>
      </template>
    </dialogVue>
  </view>
</template>

<script setup>
/**
 * 个人信息设置页面 personInfo.vue
 * 功能：
 * - 提供用户头像上传功能
 * - 编辑用户基本信息（昵称、性别、生日）
 * - 管理用户联系方式（手机号、邮箱）
 * - 数据验证和保存功能
 */
import { ref } from 'vue'
import searchVue from '@/components/search/search.vue' // 搜索输入组件
import dialogVue from '@/components/dialog/dialog.vue' // 对话框组件
import { showToast } from '@/untils/index.js' // 提示框工具函数
import { userStore } from '@/stores/user' // 用户状态管理

// 用户状态管理实例
const useUserStore = userStore()

// 对话框相关状态
const dialogShow = ref(false) // 控制对话框显示/隐藏
const dialogInput = ref('') // 对话框输入框内容
const showType = ref('') // 当前操作类型（phone/email）
const title = ref('') // 对话框标题

/**
 * 更换头像
 * 功能：调用系统图片选择器，选择并更新用户头像
 */
const changeAvatar = () => {
  uni.chooseImage({
    count: 1, // 最多选择1张图片
    success: (res) => {
      // 实际项目中这里应该上传图片并更新头像
      useUserStore.userInfo.avatarUrl = res.tempFilePaths[0]
      uni.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

/**
 * 生日选择变化处理
 * @param {Object} e - 选择器事件对象，包含选择的日期值
 */
const onBirthdayChange = (e) => {
  useUserStore.userInfo.birthday = e.detail.value
}

/**
 * 修改手机号
 * 功能：打开手机号编辑对话框
 */
const changePhone = () => {
  showType.value = 'phone'
  dialogInput.value = useUserStore.userInfo.phone
  title.value = useUserStore.userInfo.phone ? '修改手机号' : '绑定手机号'
  dialogShow.value = true
}

/**
 * 修改邮箱
 * 功能：打开邮箱编辑对话框
 */
const changeEmail = () => {
  showType.value = 'email'
  dialogInput.value = useUserStore.userInfo.email
  title.value = useUserStore.userInfo.email ? '修改邮箱' : '绑定邮箱'
  dialogShow.value = true
}

/**
 * 对话框确认回调
 * 功能：确认修改手机号或邮箱
 */
const dialogConfirm = () => {
  const confirm = reviseBrithdayAndEmail(showType.value)
  if (confirm) {
    dialogShow.value = false
  }
}

/**
 * 验证并修改生日和邮箱
 * @param {string} showType - 操作类型（phone/email）
 * @returns {boolean} - 验证结果，true表示验证通过
 */
function reviseBrithdayAndEmail(showType) {
  // 验证输入不能为空
  if (!dialogInput.value) {
    showToast('请输入值', 'error')
    return false
  }

  // 验证手机号格式
  if (showType === 'phone') {
    const phoneRegex =
      /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    if (!phoneRegex.test(dialogInput.value)) {
      showToast('格式错误', 'error')
      return false
    }
    useUserStore.userInfo.phone = dialogInput.value
    return true
  }
  // 验证邮箱格式
  else {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(dialogInput.value)) {
      showToast('格式错误', 'error')
      return false
    }
    useUserStore.userInfo.email = dialogInput.value
    return true
  }
}

/**
 * 保存用户信息
 * 功能：保存用户修改的所有信息
 */
const saveInfo = () => {
  console.log(useUserStore.userInfo)
  uni.showToast({
    title: '个人信息保存成功',
    icon: 'success'
  })

  // 实际项目中这里应该调用API保存用户信息
  useUserStore.storageUser()
}
</script>

<style lang="scss" scoped>
/**
 * 个人信息页面样式定义
 * 样式结构：
 * - 页面基础样式：整体布局和背景设置
 * - 容器样式：页面内容容器和卡片样式
 * - 头像区域样式：头像上传区域样式
 * - 表单样式：输入框、标签等表单元素样式
 * - 性别选择样式：性别选项按钮样式
 * - 联系方式样式：联系方式展示和修改按钮样式
 * - 对话框样式：对话框和输入框样式
 * - 保存按钮样式：保存按钮样式
 */

// 页面基础样式
.personal-info-page {
  background-color: $gray-50; // 页面背景色，使用浅灰色增强可读性
  color: $gray-800; // 页面文字颜色
  min-height: 100vh; // 最小高度占满整个视口
}

// 页面容器样式
.page-container {
  padding: $spacing-page; // 页面内边距
}

// 页面头部样式
.page-header {
  margin-bottom: $spacing-6; // 底部外边距

  .header-content {
    display: flex; // 弹性布局
    justify-content: space-between; // 两端对齐
    align-items: center; // 垂直居中对齐
  }

  .back-button {
    background: none; // 无背景色
    border: none; // 无边框
    color: $gray-600; // 文本颜色
    font-size: $text-lg; // 字体大小
    padding: $spacing-2; // 内边距
  }

  .page-title {
    font-size: $text-xl; // 字体大小
    font-weight: 600; // 字体粗细
    color: $gray-800; // 文本颜色
  }

  .header-actions {
    display: flex; // 弹性布局
    align-items: center; // 垂直居中对齐
  }

  .save-button {
    background: none; // 无背景色
    border: none; // 无边框
    color: $primary-color; // 文本颜色，使用主题色
    font-size: $text-base; // 字体大小
    font-weight: 500; // 字体粗细
  }
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
  text-align: center; // 文字居中对齐
  font-weight: 500; // 字体粗细
  color: $gray-700; // 文本颜色
  margin-bottom: $spacing-page; // 底部外边距
  display: block; // 确保是块级元素，方便设置边距
}

// 头像设置样式
.avatar-section {
  .avatar-content {
    display: flex; // 弹性布局
    justify-content: center; // 水平居中对齐
  }

  .avatar-wrapper {
    position: relative; // 相对定位，方便后续添加绝对定位元素
    display: inline-block; // 内联块级元素
  }

  .user-avatar {
    width: 130rpx; // 头像宽度
    height: 130rpx; // 头像高度
    border-radius: 50%; // 圆形头像
    border: 4rpx solid #dbeafe; // 头像边框，使用浅蓝色增强视觉效果
  }

  .change-avatar-btn {
    position: absolute; // 绝对定位，相对于父元素定位
    bottom: 0; // 底部对齐
    right: 0; // 右侧对齐
    width: 48rpx; // 按钮宽度
    height: 48rpx; // 按钮高度
    border-radius: 50%; // 圆形按钮
    background-color: $primary-color; // 按钮背景色，使用主题色
    color: $white; // 按钮文字颜色
    border: none; // 无边框
    display: flex; // 弹性布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    font-size: $text-sm; // 字体大小
  }
}

// 表单样式
.form-list {
  .form-item {
    margin-bottom: $spacing-4; // 底部外边距
    border-bottom: 2rpx solid $gray-100; // 下划线，区分不同表单项

    &:last-child {
      margin-bottom: 0rpx; // 最后一项无边框，避免底部出现多余分隔线
    }
  }

  .form-label {
    font-size: $text-base; // 字体大小
    color: $gray-700; // 文本颜色
    margin-bottom: $spacing-page; // 底部外边距
    display: block; // 确保是块级元素，方便设置边距
  }

  .input-box {
    height: 75rpx; // 输入框高度
    width: 100%; // 宽度占满父容器
    padding-bottom: 10rpx; // 底部内边距
  }
}

// 性别选项样式
.gender-options {
  display: flex; // 弹性布局
  padding-bottom: 20rpx; // 底部内边距
  justify-content: space-around; // 均匀分布对齐

  .gender-option {
    border: none; // 无边框
    padding: 0rpx 20rpx; // 内边距
    border-radius: 12rpx; // 圆角
    background: none; // 无背景色
    color: $gray-600; // 文本颜色
    font-size: $text-base; // 字体大小
    transition: all 0.3s ease; // 过渡动画效果
    margin: 0rpx; // 外边距

    &::after {
      display: none; // 隐藏默认按钮样式
    }

    &.active {
      border-color: $primary-color; // 激活状态边框颜色，使用主题色
      background-color: rgba(
        $primary-color,
        0.1
      ); // 激活状态背景色，使用主题色的透明版本
      color: $primary-color; // 激活状态文本颜色，使用主题色
    }
  }
}

// 日期选择器样式
.date-picker {
  width: 100%; // 宽度占满父容器
}

.date-display {
  font-size: $text-base; // 字体大小
  color: $gray-800; // 文本颜色
  padding: $spacing-3 0; // 上下内边距
}

// 文本域样式
.form-textarea {
  width: 100%; // 宽度占满父容器
  border: 2rpx solid $gray-200; // 边框，使用浅灰色
  border-radius: 12rpx; // 圆角
  padding: $spacing-3; // 内边距
  font-size: $text-base; // 字体大小
  color: $gray-800; // 文本颜色
  min-height: 120rpx; // 最小高度

  &::placeholder {
    color: $gray-400; // 占位文本颜色
  }
}

// 字数统计样式
.char-count {
  font-size: $text-xs; // 字体大小
  color: $gray-400; // 文本颜色
  text-align: right; // 文字右对齐
  display: block; // 确保是块级元素，方便设置边距
  margin-top: $spacing-2; // 顶部外边距
}

// 联系方式样式
.contact-content {
  display: flex; // 弹性布局
  align-items: center; // 垂直居中对齐
  padding-bottom: 20rpx; // 底部内边距

  .contact-value {
    font-size: $text-base; // 字体大小
    color: $gray-800; // 文本颜色
    flex: 1; // 占满剩余空间
  }

  .change-button {
    background: none; // 无背景色
    border: none; // 无边框
    color: $primary-color; // 文本颜色，使用主题色
    font-size: $text-sm; // 字体大小
  }
}

// 安全设置样式
.security-list {
  .security-item {
    display: flex; // 弹性布局
    justify-content: space-between; // 两端对齐
    align-items: center; // 垂直居中对齐
    padding: $spacing-4 0; // 上下内边距
    border-bottom: 2rpx solid $gray-100; // 下划线，区分不同安全项

    &:last-child {
      border-bottom: none; // 最后一项无边框，避免底部出现多余分隔线
    }
  }

  .security-info {
    display: flex; // 弹性布局
    align-items: center; // 垂直居中对齐
  }

  .iconfont {
    font-size: $text-base; // 字体大小
    color: $gray-500; // 文本颜色
    margin-right: $spacing-3; // 右侧外边距
    width: 40rpx; // 固定宽度
    text-align: center; // 文字居中对齐
  }

  .security-text {
    font-size: $text-base; // 字体大小
    color: $gray-700; // 文本颜色
  }
}

// 对话框样式
.dialog-body {
  width: 100%; // 宽度占满父容器

  .title {
    font-size: $text-sm; // 字体大小
    color: $gray-500; // 文本颜色
    margin-bottom: 16rpx; // 底部外边距
  }

  .input-box {
    padding: 10rpx; // 内边距
    border: 1px solid #e2e8f0; // 边框，使用浅灰色
    border-radius: 8px; // 圆角
    height: 65rpx; // 高度
    margin-bottom: 40rpx; // 底部外边距
  }

  .tips {
    font-size: $text-xs; // 字体大小
  }
}

// 保存按钮样式
.saveBtn {
  border: none; // 无边框
  margin: 0rpx; // 无边距
  background: #3b82f6; // 背景色，使用主题色
  color: $white; // 文字颜色
  padding: 0rpx; // 无边距
  display: flex; // 弹性布局
  justify-content: center; // 水平居中对齐
  align-items: center; // 垂直居中对齐

  &::after {
    display: none; // 隐藏默认按钮样式
  }
}
</style>
