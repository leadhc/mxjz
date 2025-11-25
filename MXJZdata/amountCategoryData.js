/**
 * 金额分类数据文件 amountCategoryData.js
 * 包含支出和收入的分类数据，用于在记账页面中选择分类
 * 
 * 分类数据结构说明：
 * - id: 分类唯一标识
 * - title: 分类名称
 * - icon: 图标Unicode码（用于显示分类图标）
 * - iconColor: 图标颜色
 * - type: 分类类型（'expense' 或 'income'）
 * - color: 图标背景颜色
 */

// 支出分类数据
export const expenseCategoryData = [
  {
    id: 1,
    title: '餐饮',
    icon: '101db',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 2,
    title: '购物',
    icon: 'e7e3',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 3,
    title: '住房',
    icon: 'e6b0',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 4,
    title: '交通',
    icon: 'e609',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 5,
    title: '医疗',
    icon: 'e621',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 6,
    title: '教育',
    icon: 'e625',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 7,
    title: '娱乐',
    icon: 'e61f',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  },
  {
    id: 8,
    title: '其他',
    icon: 'e618',
    iconColor: '#ef4444',
    type: 'expense',
    color: '#fee2e2'
  }
]

// 收入分类数据
export const incomeCategoryData = [
  {
    id: 1,
    title: '工资',
    icon: 'ee16',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 2,
    title: '奖金',
    icon: 'e64a',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 3,
    title: '投资',
    icon: 'e754',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 4,
    title: '兼职',
    icon: 'e60d',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 5,
    title: '理财',
    icon: 'e68a',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 6,
    title: '退款',
    icon: 'e629',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 7,
    title: '红包',
    icon: 'e626',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  },
  {
    id: 8,
    title: '其他',
    icon: 'e618',
    iconColor: '#16a34a',
    type: 'income',
    color: '#dcfce7'
  }
]

/**
 * 数据使用说明：
 * 1. 这些分类数据在 classifyCard.vue 组件中被导入和使用
 * 2. 根据当前记账类型（支出/收入）动态加载对应的分类列表
 * 3. 用户可以选择一个分类，然后该分类信息会被传递给父组件
 * 4. 每个分类包含图标、标题、颜色等信息，用于在界面上展示
 * 5. 支出分类使用红色系（#ef4444），收入分类使用绿色系（#16a34a）
 */
