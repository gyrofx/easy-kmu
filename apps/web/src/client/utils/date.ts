import {
  addDays,
  addHours,
  addMinutes,
  intervalToDuration,
  isMonday,
  previousMonday,
  secondsToMilliseconds,
} from 'date-fns'
import { padStart, range } from 'lodash'

export function removeTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function removeSeconds(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  )
}

export function addDecimalHours(date: Date, hours: number) {
  const minutes = (hours - Math.floor(hours)) * 60
  return addMinutes(addHours(date, hours), minutes)
}

export function secondsToTimeString(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: secondsToMilliseconds(seconds) })

  return `${duration.hours}:${padStart(duration.minutes?.toString(), 2, '0')}`
}

export function startAndEndOfWeek(dayInWeek: Date) {
  const startOfWeek = isMonday(dayInWeek) ? dayInWeek : previousMonday(dayInWeek)
  const endOfWeek = addDays(startOfWeek, 6)

  return { startOfWeek, endOfWeek }
}

export function weekDates(dayInWeek: Date) {
  const { startOfWeek } = startAndEndOfWeek(dayInWeek)

  return range(0, 7).map((days) => addDays(startOfWeek, days))
}
