export const transactions = [
  {
    id: 1,
    title: '午餐',
    category: 'food',
    type: 'expense',
    amount: 35.0,
    iconColor: '#ef4444',
    time: new Date(),
    note: '公司楼下餐厅',
    icon: '101db',
    status: '已完成'
  },
  {
    id: 2,
    title: '工资',
    category: 'salary',
    type: 'income',
    amount: 8650.0,
    iconColor: '#16a34a',
    time: new Date(),
    note: '10月份工资',
    icon: 'ee16',
    status: '已完成'
  },
  {
    id: 3,
    title: '超市购物',
    category: 'shopping',
    type: 'expense',
    amount: 128.5,
    iconColor: '#ef4444',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    note: '永辉超市',
    icon: 'e7e3',
    status: '已完成'
  },
  {
    id: 4,
    title: '交通费',
    category: 'transport',
    type: 'expense',
    amount: 8.0,
    iconColor: '#ef4444',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    note: '地铁通勤',
    icon: 'e609',
    status: '已完成'
  },
  {
    id: 5,
    title: '房租',
    category: 'housing',
    type: 'expense',
    amount: 2000.0,
    time: new Date(Date.now() - 48 * 60 * 60 * 1000),
    note: '11月份房租',
    icon: 'e6b0',
    iconColor: '#ef4444',
    status: '已完成'
  },
  {
    id: 6,
    title: '兼职收入',
    category: 'part-time',
    type: 'income',
    amount: 300.0,
    iconColor: '#16a34a',
    time: new Date(Date.now() - 48 * 60 * 60 * 1000),
    note: '设计兼职',
    icon: 'e60d',
    status: '已完成'
  }
]
