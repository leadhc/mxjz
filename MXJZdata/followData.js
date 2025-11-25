/**
 * 模拟“我关注的人”列表数据
 * follow 字段表示当前是否已关注（用于按钮状态）
 */
import { ref } from 'vue'
export const followingUsers = ref([
  {
    id: 1,
    name: '财务自由人',
    desc: '分享记账和理财经验',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    follow: true
  },
  {
    id: 2,
    name: '理财小达人',
    desc: '5年投资经验分享',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    follow: false
  },
  {
    id: 3,
    name: '省钱小能手',
    desc: '日常省钱技巧分享',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    follow: false
  },
  {
    id: 4,
    name: '债务规划师',
    desc: '信用卡债务管理专家',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    follow: false
  },
  {
    id: 5,
    name: '记账助手',
    desc: '记账习惯养成专家',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    follow: false
  }
])

/**
 * 模拟“推荐关注”列表数据
 */
export const recommendedUsers = ref([
  {
    id: 6,
    name: '投资顾问',
    desc: '专业投资建议',
    avatar: 'https://s.coze.cn/image/yPuOZECE2WI/',
    follow: false
  },
  {
    id: 7,
    name: '财富管家',
    desc: '家庭理财规划',
    avatar: 'https://s.coze.cn/image/yPuOZECE2WI/',
    follow: false
  }
])
