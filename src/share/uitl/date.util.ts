import dayjs from "dayjs";

type WideDate = number | string | Date

interface DifferDate {
  yyyy: number
  MM: number
  dd: number
  HH: number
  mm: number
  ss: number
  timeStamp: number
  date: Date
}

/**
 * 分钟计算
 * @param date 初始的日期
 * @param delta 需要变化的日期
 */
export function addMinutes(date: WideDate = new Date(), delta = 0): Date {
  const newDate = new Date(date)
  if (delta) {
    newDate.setMinutes(newDate.getMinutes() + delta)
    return newDate
  }
  return newDate
}

/**
 * 小时计算
 * @param date 初始的日期
 * @param delta 需要变化的日期
 */
export function addHours(date: WideDate = new Date(), delta = 0): Date {
  const newDate = new Date(date)
  if (delta) {
    newDate.setHours(newDate.getHours() + delta)
    return newDate
  }
  return newDate
}

/**
 * 日期计算
 * @param date 初始的日期
 * @param delta 需要变化的日期
 */
export function addDay(date: WideDate = new Date(), delta = 0): Date {
  const newDate = new Date(date)
  if (delta) {
    newDate.setDate(newDate.getDate() + delta)
    return newDate
  }
  return newDate
}

/**
 * 月份计算
 * @param date 初始的日期
 * @param delta 需要变化的月份
 */
export function addMonth(date: WideDate = new Date(), delta = 0): Date {
  const newDate = new Date(date)
  if (delta) {
    newDate.setMonth(newDate.getMonth() + delta)
    return newDate
  }
  return newDate
}

/**
 * 月份计算
 * @param date 初始的日期
 * @param delta 需要变化的年份
 */
export function addYear(date: WideDate = new Date(), delta = 0): Date {
  const newDate = new Date(date)
  if (delta) {
    newDate.setFullYear(newDate.getFullYear() + delta)
    return newDate
  }
  return newDate
}

/**
 * 两日期的差值
 * @param date 减去日期
 * @param defaultDate 被减日期
 */
export function differTo(
  date: WideDate = new Date(),
  defaultDate: WideDate = new Date()
): DifferDate {
  const dateFormat = new Date(date)
  const defaultDateFormat = new Date(defaultDate)
  const timeStamp = defaultDateFormat.getTime() - dateFormat.getTime()
  return {
    yyyy: defaultDateFormat.getFullYear() - dateFormat.getFullYear(),
    MM: defaultDateFormat.getMonth() - dateFormat.getMonth(),
    dd: defaultDateFormat.getDate() - dateFormat.getDate(),
    HH: defaultDateFormat.getHours() - dateFormat.getHours(),
    mm: defaultDateFormat.getMinutes() - dateFormat.getMinutes(),
    ss: defaultDateFormat.getSeconds() - dateFormat.getSeconds(),
    timeStamp,
    date: new Date(timeStamp)
  }
}

export function equalsMonth(value: Date, target: Date) {
  return (
    value.getFullYear() === target.getFullYear() &&
    value.getMonth() === target.getMonth()
  )
}

export function equalsDay(value: Date, target: Date) {
  return (
    value.getFullYear() === target.getFullYear() &&
    value.getMonth() === target.getMonth() &&
    value.getDate() === target.getDate()
  )
}

export function format(date: Date, formatString = "YYYY-MM-DD") {
  return dayjs(date).format(formatString)
}

// export function dateToTimeList(date: Date, long: number) {
//   let i = 0
//   const list: string[] = []
//   while (i < long) {
//     list.push(format(addMinutes(date, i), "HH:mm"))
//     i++
//   }
//   return list
// }

export function ago(date = new Date()) {
  const differ = differTo(date)
  const keys = Object.keys(differ)
  for (const key of keys) {
    if (key === "yyyy" && differ[key] > 0) {
      return differ[key] + "年前"
    } else if (key === "MM" && differ[key] > 0) {
      return differ[key] + "月前"
    } else if (key === "dd" && differ[key] > 0) {
      return differ[key] + "天前"
    } else if (key === "HH" && differ[key] > 0) {
      return differ[key] + "小时前"
    } else if (key === "mm" && differ[key] > 0) {
      return differ[key] + "分钟前"
    } else if (key === "ss" && differ[key] > 0) {
      return differ[key] + "秒前"
    }
  }
}
