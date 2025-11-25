// 概览数据
export const overviewDatas = [
  {
    id: 1,
    title: '总收入',
    amount: 8650.0,
    changes: 12.5,
    color: '#10b981'
  },
  {
    id: 2,
    title: '总支出',
    amount: 8650.0,
    changes: 5.2,
    color: '#ef4444'
  },
  {
    id: 3,
    title: '预算使用',
    budget: 65,
    changes: 5.2,
    changeText: '正常',
    color: '#3b82f6'
  },
  {
    id: 4,
    title: '日均支出',
    amount: 78.18,
    changes: -8.3,
    color: '#8b5cf6'
  }
]

// 支出分类数据
export const expenseCategories = [
  {
    id: 1,
    title: '住房',
    icon: 'e6b0',
    color: '#fee2e2',
    iconColor: '#ef4444',
    amount: 2000.0,
    percentage: 85.2,
    type: 'expense'
  },
  {
    id: 2,
    title: '餐饮',
    icon: '101db',
    color: '#dbeafe',
    amount: 128.5,
    iconColor: '#3b82f6',
    percentage: 6.8,
    type: 'expense'
  },
  {
    id: 3,
    title: '购物',
    icon: 'e7e3',
    color: '#dcfce7',
    iconColor: '#22c55e',
    amount: 128.5,
    percentage: 5.5,
    type: 'expense'
  },
  {
    id: 4,
    title: '交通',
    icon: 'e609',
    color: '#fef9c3',
    iconColor: '#fef9c3',
    amount: 35.0,
    percentage: 1.5,
    type: 'expense'
  },
  {
    id: 5,
    title: '娱乐',
    icon: 'e61f',
    color: '#f3e8ff',
    iconColor: '#f3e8ff',
    amount: 12.0,
    percentage: 0.5,
    type: 'expense'
  }
]

// 收入来源数据
export const incomeSources = [
  {
    id: 1,
    title: '工资收入',
    icon: 'ee16',
    type: 'income',
    color: '#dcfce7',
    iconColor: '#22c55e',
    amount: 8650.0,
    percentage: 95.4
  },
  {
    id: 2,
    title: '兼职收入',
    type: 'income',
    icon: 'e60d',
    color: '#dbeafe',
    iconColor: '#3b82f6',
    amount: 300.0,
    percentage: 3.5
  },
  {
    id: 3,
    title: '投资收益',
    type: 'income',
    icon: 'e754',
    color: '#f3e8ff',
    iconColor: '#f3e8ff',
    amount: 100.0,
    percentage: 1.1
  }
]
