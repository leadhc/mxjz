/**
 * 工具函数集合 index.js
 * 提供项目中常用的工具函数，包括日期处理、金额格式化、位置获取等功能
 */

import AMapWX from '@/libs/amap-wx.130.js' // 导入高德地图微信小程序SDK

/**
 * 获取当前日期的年、月、日信息
 * @returns {Object} 包含year、month、days的对象
 */
export const getDate = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1 // 月份从0开始，所以加1
  const days = new Date().getDate()

  return {
    year,
    month,
    days
  }
}

/**
 * 获取当前月份的总天数和剩余天数
 * @returns {Object} 包含inMonthDays（总天数）和remainingDays（剩余天数）的对象
 */
export const daysInMonth = () => {
  const { year, month, days } = getDate()
  // 获取当前月份的总天数（通过传入month+1，day=0获取上个月最后一天）
  const inMonthDays = new Date(year, month, 0).getDate()
  // 计算剩余天数
  const remainingDays = inMonthDays - days
  return {
    inMonthDays,
    remainingDays
  }
}

/**
 * 格式化金额显示
 * @param {number|string} amount - 金额数值
 * @param {boolean} showCurrency - 是否显示货币符号（默认true）
 * @returns {string} 格式化后的金额字符串
 */
export const formatAmount = (amount, showCurrency = true) => {
  // 参数验证
  if (!amount || isNaN(amount)) return '0.00'

  const num = parseFloat(amount)
  const absNum = Math.abs(num)

  // 定义单位及其对应的阈值（从大到小排序）
  const units = [
    { threshold: 1e11, unit: '千亿' }, // 千亿
    { threshold: 1e10, unit: '百亿' }, // 百亿
    { threshold: 1e9, unit: '十亿' }, // 十亿
    { threshold: 1e8, unit: '亿' }, // 亿
    { threshold: 1e4, unit: '万' } // 万
  ]

  // 检查是否需要使用大数字单位
  for (let i = 0; i < units.length; i++) {
    if (absNum >= units[i].threshold) {
      // 计算转换后的数值并保留2位小数
      const formattedValue = (num / units[i].threshold)
        .toFixed(2)
        .replace(/\.?0+$/, '') // 移除末尾多余的0
      return showCurrency
        ? `¥${formattedValue}${units[i].unit}`
        : `${formattedValue}${units[i].unit}`
    }
  }

  // 小于10万的金额直接显示
  return showCurrency
    ? `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
}

/**
 * 格式化时间显示
 * @param {number|string|Date} time - 时间值
 * @param {number} formatType - 格式化类型（1或2）
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (time, formatType = 1) => {
  const date = new Date(time)

  // 提取公共的时间格式化函数（时分）
  const formatHourMinute = () => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // 格式1：根据时间差显示不同格式（2天内显示时间，超过显示日期+时间）
  if (formatType === 1) {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 48) {
      return formatHourMinute()
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日 ${formatHourMinute()}`
    }
  }

  // 格式2：返回完整的年月日时分秒
  if (formatType === 2) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  }

  return '格式参数错误'
}

/**
 * 显示提示消息
 * @param {string} titles - 提示内容
 * @param {string} icons - 图标类型（默认'success'）
 */
export const showToast = (titles, icons) => {
  uni.showToast({
    title: titles,
    icon: icons || 'success'
  })
}

/**
 * 获取用户当前位置信息
 * @param {string} keys - 高德地图API密钥
 * @returns {Promise} - 返回位置信息的Promise
 */
export const getUserLocation = (keys) => {
  return new Promise((res, rej) => {
    // 初始化高德地图实例
    const myAmpap = new AMapWX({ key: keys })
    // 获取逆地理编码信息（根据经纬度获取位置描述）
    myAmpap.getRegeo({
      success: (data) => {
        res(data)
      },
      fail: (info) => {
        // 获取失败时显示提示
        uni.showToast({
          title: '获取位置失败',
          icon: 'error'
        })
        rej(info)
      }
    })
  })
}

/**
 * 获取DOM元素的宽高信息
 * 支持获取单个元素、多个同类元素或多个不同选择器的元素
 * @param {string|Array} selectors - CSS选择器（字符串或数组）
 * @param {boolean} all - 当selectors为字符串时，是否获取所有匹配的元素
 * @returns {Promise} - 返回元素宽高信息的Promise
 */
export const getDomRect = (selectors, all = false) => {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery()

    // 如果是数组：查询多个不同选择器
    if (Array.isArray(selectors)) {
      const results = {}
      let completed = 0
      const total = selectors.length

      selectors.forEach((selector) => {
        query.select(selector).boundingClientRect((rect) => {
          results[selector] = rect // 用选择器作为key
          completed++
          if (completed === total) {
            resolve(results)
          }
        })
      })

      query.exec()
    }
    // 如果是字符串且all=true：查询多个同类元素
    else if (typeof selectors === 'string' && all) {
      query
        .selectAll(selectors)
        .boundingClientRect((rects) => {
          resolve(rects) // rects是数组，包含所有匹配元素的信息
        })
        .exec()
    }
    // 默认：单个元素
    else if (typeof selectors === 'string') {
      query
        .select(selectors)
        .boundingClientRect((rect) => {
          resolve(rect)
        })
        .exec()
    } else {
      reject(new Error('Invalid selectors argument'))
    }
  })
}
