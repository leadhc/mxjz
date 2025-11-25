<template>
  <!-- 帮助与反馈页面主容器，用于整体布局和背景设置 -->
  <view class="help-feedback-page">
    <view class="page-container">
      <!-- 常见问题区域，展示可展开/收起的FAQ列表 -->
      <view class="faq-section card">
        <text class="section-title">常见问题</text>
        <view class="faq-list">
          <!-- 常见问题列表项，支持点击展开/收起答案 -->
          <view
            v-for="(faq, index) in filteredFAQs"
            :key="faq.id"
            class="faq-item"
            @click="toggleFAQ(index)"
          >
            <view class="faq-question">
              <text class="question-text">{{ faq.question }}</text>
              <!-- 展开/收起图标，根据faq.expanded状态动态切换 -->
              <text
                class="iconfont"
                :class="faq.expanded ? 'icon-chevron-up' : 'icon-chevron-down'"
              ></text>
            </view>
            <!-- 答案内容，仅在展开状态下显示 -->
            <view v-if="faq.expanded" class="faq-answer">
              <text class="answer-text">{{ faq.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 反馈类型区域，提供不同类型的问题反馈入口 -->
      <view class="feedback-types card">
        <text class="section-title">问题反馈</text>
        <view class="feedback-list">
          <!-- 功能异常反馈选项，点击后打开反馈提交弹窗 -->
          <view class="feedback-item" @click="submitFeedback('bug')">
            <view class="feedback-info">
              <view class="feedback-details">
                <text class="feedback-title">功能异常</text>
                <text class="feedback-desc">功能无法正常使用或出现错误</text>
              </view>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>

          <!-- 产品建议反馈选项，点击后打开反馈提交弹窗 -->
          <view class="feedback-item" @click="submitFeedback('suggestion')">
            <view class="feedback-info">
              <view class="feedback-details">
                <text class="feedback-title">产品建议</text>
                <text class="feedback-desc">对产品的改进建议或新功能想法</text>
              </view>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>

          <!-- 内容问题反馈选项，点击后打开反馈提交弹窗 -->
          <view class="feedback-item" @click="submitFeedback('content')">
            <view class="feedback-info">
              <view class="feedback-details">
                <text class="feedback-title">内容问题</text>
                <text class="feedback-desc">举报不当内容或用户行为</text>
              </view>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>
        </view>
      </view>

      <!-- 联系客服区域，展示联系方式和服务时间 -->
      <view class="contact-section card">
        <text class="section-title">联系客服</text>
        <view class="contact-methods">
          <!-- 电话联系方式，提供拨打按钮 -->
          <view class="contact-method">
            <view>
              <iconsVue
                iconType="''"
                iconUcode="e603"
                iconSize="25"
                iconColor="#3b82f6"
              ></iconsVue>
            </view>
            <view class="contact-details">
              <text class="contact-type">客服电话</text>
              <text class="contact-value">400-123-4567</text>
            </view>
            <button class="contact-button" @click="makeCall" size="mini">
              拨打
            </button>
          </view>

          <!-- 邮箱联系方式，提供发送按钮 -->
          <view class="contact-method">
            <view>
              <iconsVue
                iconType="''"
                iconUcode="e627"
                iconSize="25"
                iconColor="#22c55e"
              ></iconsVue>
            </view>
            <view class="contact-details">
              <text class="contact-type">客服邮箱</text>
              <text class="contact-value">support@example.com</text>
            </view>
            <button class="contact-button" @click="sendEmail" size="mini">
              发送
            </button>
          </view>

          <!-- 服务时间信息，显示客服在线时间 -->
          <view class="contact-method">
            <view>
              <iconsVue
                iconType="''"
                iconUcode="e624"
                iconSize="25"
                iconColor="#eab308"
              ></iconsVue>
            </view>
            <view class="contact-details">
              <text class="contact-type">服务时间</text>
              <text class="contact-value">9:00-18:00（工作日）</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于我们区域，提供相关政策和协议链接 -->
      <view class="about-section card">
        <text class="section-title">关于我们</text>
        <view class="about-options">
          <!-- 隐私政策选项，点击后查看隐私政策 -->
          <view class="about-item" @click="viewPrivacyPolicy">
            <view class="about-info">
              <view>
                <iconsVue
                  iconType="''"
                  iconUcode="e606"
                  iconSize="22"
                  iconColor="#eab308"
                ></iconsVue>
              </view>
              <text class="about-text">隐私政策</text>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>

          <!-- 用户协议选项，点击后查看用户协议 -->
          <view class="about-item" @click="viewUserAgreement">
            <view class="about-info">
              <iconsVue
                iconType="''"
                iconUcode="e61a"
                iconSize="22"
                iconColor="#ef4444"
              ></iconsVue>
              <text class="about-text">用户协议</text>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>

          <!-- 关于我们选项，点击后查看关于我们信息 -->
          <view class="about-item" @click="viewAboutUs">
            <view class="about-info">
              <iconsVue
                iconType="''"
                iconUcode="e6aa"
                iconSize="21"
                iconColor="#6b7280"
              ></iconsVue>
              <text class="about-text">关于我们</text>
            </view>
            <text class="iconfont icon-chevron-right"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 反馈提交弹窗，用于用户提交具体的反馈内容 -->
    <page-container :show="pageContainer" @afterleave="handleLeave">
      <view class="popup-box">
        <!-- 反馈内容输入框，用户输入具体的问题描述 -->
        <view class="textarea-box">
          <textarea
            class="textarea"
            v-model="inputValue"
            show-confirm-bar="{{false}}"
            placeholder="描述您遇到的问题····"
            cursor-spacing="30"
          />
        </view>
        <!-- 提交按钮，用于提交反馈内容 -->
        <view class="btn-box">
          <button class="btn sub" @click="commitSub">提交反馈</button>
        </view>
      </view>
    </page-container>
  </view>
</template>

<script setup>
/**
 * 帮助与反馈页面 helpfeed.vue
 * 功能说明：
 * - 展示常见问题（FAQ），支持展开/收起答案
 * - 提供问题反馈入口，支持不同类型的反馈（功能异常、产品建议、内容问题）
 * - 展示联系客服方式（电话、邮箱）
 * - 提供关于我们相关链接（隐私政策、用户协议、关于我们）
 * - 支持反馈内容的提交功能
 */

// 导入Vue响应式API和生命周期钩子
import { ref, computed } from 'vue'

// 导入自定义组件
import iconsVue from '@/components/icons/icons.vue' // 图标组件，用于显示各种图标

// 导入工具函数
import { showToast } from '../../untils' // 显示提示消息的工具函数

// 响应式数据定义
const searchKeyword = ref('') // 搜索关键词，用于过滤常见问题列表
const inputValue = ref('') // 反馈内容输入值，用于反馈提交弹窗
const feedbackType = ref('') // 反馈类型，记录当前选择的反馈类型（功能异常、产品建议、内容问题）
const pageContainer = ref(false) // 弹窗显示状态，控制反馈提交弹窗的显示/隐藏

// 常见问题列表数据，包含问题、答案和展开状态
const faqs = ref([
  {
    id: 1,
    question: '如何开始记账？',
    answer:
      '打开记账页面，选择支出或收入类型，输入金额，选择分类，添加备注后保存即可完成记账。',
    expanded: false // 展开状态，控制答案是否显示
  },
  {
    id: 2,
    question: '如何设置月度预算？',
    answer: '在首页点击"调整预算"按钮，输入预算金额后确认即可完成预算设置。',
    expanded: false // 展开状态，控制答案是否显示
  },
  {
    id: 5,
    question: '如何修改分类？',
    answer: '在记账页面点击分类图标，可以查看和选择不同的收支分类。',
    expanded: false // 展开状态，控制答案是否显示
  }
])

// 计算属性：根据搜索关键词过滤常见问题列表
const filteredFAQs = computed(() => {
  // 如果没有搜索关键词，返回完整的FAQ列表
  if (!searchKeyword.value) {
    return faqs.value
  }

  // 转换关键词为小写，进行不区分大小写的搜索
  const keyword = searchKeyword.value.toLowerCase()
  // 过滤出问题或答案中包含关键词的FAQ项
  return faqs.value.filter(
    (faq) =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword)
  )
})

/**
 * 切换常见问题的展开/收起状态
 * @param {number} index - 问题索引，用于定位要切换的FAQ项
 */
const toggleFAQ = (index) => {
  // 切换指定索引FAQ项的expanded状态
  faqs.value[index].expanded = !faqs.value[index].expanded
}

/**
 * 打开反馈提交弹窗
 * @param {string} type - 反馈类型（bug、suggestion、content）
 */
const submitFeedback = (type) => {
  // 显示弹窗
  pageContainer.value = true

  // 映射反馈类型到中文描述
  const types = {
    bug: '功能异常',
    suggestion: '产品建议',
    content: '内容问题'
  }

  // 设置当前反馈类型
  feedbackType.value = { type: types[type] }
}

/**
 * 处理弹窗关闭后的逻辑
 */
const handleLeave = () => {
  // 隐藏弹窗
  pageContainer.value = false

  // 清空输入内容
  inputValue.value = ''
}

/**
 * 提交反馈内容
 */
const commitSub = () => {
  // 验证输入内容是否为空
  if (!inputValue.value) {
    showToast('请描述问题', 'error')
    return
  }

  // 构建反馈数据，添加用户输入的反馈内容
  feedbackType.value = { ...feedbackType.value, value: inputValue.value }
  console.log(feedbackType.value)

  // 显示提交成功提示
  showToast('模拟提交反馈', 'success')

  // 关闭弹窗
  pageContainer.value = false
}

/**
 * 拨打电话
 */
const makeCall = () => {
  // 调用uni-app的拨打电话API
  uni.makePhoneCall({
    phoneNumber: '4001234567'
  })
}

/**
 * 发送邮件
 */
const sendEmail = () => {
  // 显示提示消息（模拟功能，实际项目中应实现邮件发送功能）
  uni.showToast({
    title: '该功能需要相关配置',
    icon: 'none'
  })
}

/**
 * 查看隐私政策
 */
const viewPrivacyPolicy = () => {
  // 显示提示消息（模拟功能，实际项目中应跳转到隐私政策页面）
  uni.showToast({
    title: '该功能开发中',
    icon: 'none'
  })
}

/**
 * 查看用户协议
 */
const viewUserAgreement = () => {
  // 显示提示消息（模拟功能，实际项目中应跳转到用户协议页面）
  uni.showToast({
    title: '该功能开发中',
    icon: 'none'
  })
}

/**
 * 查看关于我们
 */
const viewAboutUs = () => {
  // 显示提示消息（模拟功能，实际项目中应跳转到关于我们页面）
  uni.showToast({
    title: '该功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.help-feedback-page {
  background-color: $gray-50;
  color: $gray-800;
  min-height: 100vh;
}

.page-container {
  padding: $spacing-page;
}

.card {
  background-color: $white;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: $spacing-4;
  padding: $spacing-page;
}

.section-title {
  font-size: $text-lg;
  font-weight: 500;
  color: $gray-700;
  padding-bottom: $spacing-4;
  display: block;
  border-bottom: 2rpx solid #f1f5f9;
}

.faq-section {
  .faq-list {
    .faq-item {
      border-bottom: 2rpx solid $gray-100;

      &:last-child {
        border-bottom: none;
      }
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-4 0;
      cursor: pointer;
    }

    .question-text {
      font-size: $text-base;
      color: $gray-800;
      flex: 1;
      margin-right: $spacing-3;
    }

    .faq-answer {
      padding-bottom: $spacing-4;
    }

    .answer-text {
      font-size: $text-sm;
      color: $gray-600;
      line-height: 1.6;
    }
  }
}

.feedback-types {
  .feedback-list {
    .feedback-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-4 0;
      border-bottom: 2rpx solid $gray-100;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }
    }

    .feedback-info {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .feedback-details {
      flex: 1;
    }

    .feedback-title {
      font-size: $text-base;
      color: $gray-800;
      margin-bottom: $spacing-1;
      display: block;
    }

    .feedback-desc {
      font-size: $text-sm;
      color: $gray-500;
      display: block;
    }
  }
}

.contact-section {
  .contact-methods {
    .contact-method {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-4 0;
      border-bottom: 2rpx solid $gray-100;

      &:last-child {
        border-bottom: none;
      }
    }

    .contact-details {
      flex: 1;
    }

    .contact-type {
      font-size: $text-base;
      color: $gray-800;
      margin-bottom: $spacing-1;
      display: block;
    }

    .contact-value {
      font-size: $text-sm;
      color: $gray-500;
      display: block;
    }

    .contact-button {
      color: $white;
      border-radius: 20rpx;
      padding: 0rpx 20rpx;
      margin: 0rpx;
      font-size: $text-sm;
      font-weight: 500;
      width: 140rpx;
      display: flex;
      justify-content: center;
      align-content: center;
      background: #3b82f6;
      &::after {
        display: none;
      }

      &:active {
        background-color: rgba($primary-color, 0.1);
      }
    }
  }
}

.about-section {
  .about-options {
    .about-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-4 0;
      border-bottom: 2rpx solid $gray-100;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }
    }

    .about-info {
      display: flex;
      align-items: center;
    }

    .about-text {
      font-size: $text-base;
      color: $gray-700;
    }
  }
}

.popup-box {
  width: 100%;
  background: $white;
  padding: $spacing-page;
  box-sizing: border-box;
  overflow: hidden;
  height: 10vh;
  animation: growToFullHeight 0.4s ease-out forwards;

  .textarea-box {
    width: 100%;
    margin-bottom: 60rpx;
    .textarea {
      min-height: 300rpx;
      display: block;
      width: 100%;
      border: 2rpx solid #f1f5f9;
      border-radius: 24rpx;
      padding: 20rpx;
      box-sizing: border-box;
    }
  }

  .btn-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    column-gap: 30rpx;

    .btn {
      border: none;
      margin: 0rpx;
      background: #3b82f6ba;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        display: none;
      }
    }

    .sub {
      background: #dbeafe;
      color: #334155;
    }
  }
}

@keyframes growToFullHeight {
  from {
    height: 10vh;
  }
  to {
    height: 100vh;
  }
}
</style>
