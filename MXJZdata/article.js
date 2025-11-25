import { ref } from 'vue'
// 文章数据
export const postData = ref({
  id: 1,
  title: '分享我的三年记账经验，从月光族到存款20万',
  content: `三年前我还是一个标准的月光族，每个月工资到手没几天就花光了。后来开始记账，慢慢改变了消费习惯，现在已经存下了20万。今天想分享一下我的记账心得和省钱技巧。

记账的初衷
记得刚开始工作的时候，每个月工资到手总觉得不够用。明明没买什么大件物品，但钱就是不知不觉花光了。直到有一天，我意识到需要改变这种状况，于是开始尝试记账。

记账的三个阶段
• 第一阶段：手动记账 - 使用笔记本记录每一笔开销，坚持了3个月
• 第二阶段：电子表格 - 使用Excel表格分类统计，持续了半年
• 第三阶段：专业记账App - 使用专业的记账软件，一直坚持到现在

我的省钱技巧
通过记账，我发现了自己的消费黑洞，并逐步改变了消费习惯：
• 制定月度预算，严格控制各项支出
• 建立紧急备用金，避免意外支出打乱计划
• 定期复盘消费记录，找出不必要的开支
• 设立储蓄目标，保持存钱的动力

收获与感悟
记账三年，我不仅存下了20万，更重要的是养成了良好的消费习惯和理财意识。记账不仅仅是记录数字，更是对自己财务状况的掌控和规划。

希望我的经验能够帮助到正在阅读这篇文章的你，让我们一起走向财务自由！`,
  time: '2小时前',
  viewCount: 1280,
  likeCount: 128,
  commentCount: 45,
  like: false,
  bookmarked: false,
  images: [
    'https://s.coze.cn/image/example1.jpg',
    'https://s.coze.cn/image/example2.jpg'
  ],
  author: {
    id: 1,
    name: '财务自由人',
    avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
    description: '记账达人 | 理财规划师 | 已帮助500+人实现财务自由',
    follow: false,
    stats: {
      posts: 56,
      followers: 2840,
      likes: 15600
    }
  }
})

export const basePosts = ref([
  {
    id: 1,
    title: '分享我的三年记账经验，从月光族到存款20万',
    excerpt: '三年前我还是一个标准的月光族',
    author: {
      name: '财务自由人',
      avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/'
    },
    time: '2小时前',
    category: 'finance',
    like: 128,
    comment: 45,
    liked: false,
    bookmarked: false
  },
  {
    id: 2,
    title: '新手如何开始投资理财？这几个步骤一定要知道',
    excerpt: '很多人想开始投资理财，但不知道从何入手...',
    author: {
      name: '理财小达人',
      avatar: 'https://s.coze.cn/image/dfBllufQCV0/'
    },
    time: '昨天',
    category: 'investment',
    like: 256,
    comment: 89,
    liked: false,
    bookmarked: false
  },
  {
    id: 3,
    title: '日常省钱技巧分享，每月轻松省下1000元',
    excerpt: '在日常生活中，有很多省钱的小技巧...',
    author: {
      name: '省钱小能手',
      avatar: 'https://s.coze.cn/image/yPuOZECE2WI/'
    },
    time: '3天前',
    category: 'saving',
    like: 189,
    comment: 67,
    liked: false,
    bookmarked: false
  },
  {
    id: 4,
    title: '如何有效管理信用卡债务？避免成为卡奴的方法',
    excerpt: '信用卡是一把双刃剑...',
    author: {
      name: '债务规划师',
      avatar: 'https://s.coze.cn/image/gOoTV10QfDM/'
    },
    time: '1周前',
    category: 'debt',
    like: 156,
    comment: 78,
    liked: false,
    bookmarked: false
  }
])
