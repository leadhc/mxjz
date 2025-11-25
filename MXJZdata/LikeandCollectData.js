/**
 * 模拟当前页面展示的文章列表（点赞或收藏）
 * 包含点赞状态（like）、收藏状态（collect）等字段
 */
import { ref } from 'vue'
export const likedArticles = ref([
  {
    id: 1,
    name: '财务自由人',
    time: '3天前',
    title: '分享我的三年记账经验，从月光族到存款20万',
    excerpt:
      '三年前我还是一个标准的月光族，每个月工资到手没几天就花光了。后来开始记账，慢慢改变了消费习惯，现在已经存下了20万。今天想分享一下我的记账心得和省钱技巧...',
    likeNum: '189',
    like: true,
    comments: '45',
    collect: true,
    author: {
      avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
      name: '财务自由人'
    }
  },
  {
    id: 2,
    time: '1周前',
    title: '新手如何开始投资理财？这几个步骤一定要知道',
    excerpt:
      '很多人想开始投资理财，但不知道从何入手。作为一个有五年投资经验的人，我想分享一下新手如何开始投资理财的步骤，包括如何设定目标、如何选择投资产品、如何控制风险...',
    likeNum: '189',
    like: true,
    comments: '89',
    collect: true,
    author: {
      avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
      name: '理财小达人'
    }
  },
  {
    id: 3,
    time: '2周前',
    title: '日常省钱技巧分享，每月轻松省下1000元',
    excerpt:
      '在日常生活中，有很多省钱的小技巧，只要稍微注意一下，每月就能轻松省下不少钱。今天我就来分享一些我常用的省钱技巧，包括购物技巧、饮食技巧、交通技巧等等...',
    likeNum: '189',
    like: true,
    comments: '67',
    collect: true,
    author: {
      avatar: 'https://s.coze.cn/image/LU-sX2dUVxY/',
      name: '省钱小能手'
    }
  }
])
