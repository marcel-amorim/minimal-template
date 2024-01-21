import dayjs, { ManipulateType } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

//dates input and output always in ISO, except when input for parsing

export function parseBrazilianDate(date: string): Date | null {
  const dayjsDate = dayjs(date, 'DD/MM/YYYY', true)

  if (!dayjsDate.isValid()) return null

  return dayjsDate.toDate()
}

export function formatBrazilianDate(date: string): string | null {
  return dayjs(date).format('DD/MM/YYYY')
}

export function isContainedInTimeFrame(date: Date, startDate: Date, endDate: Date): boolean {
  const dayjsDate = dayjs(date)

  return dayjsDate.isBetween(startDate, endDate, null, '[]') // '[]' includes the boundaries
}

export function formatDate(date: Date, lng: string, format: string): string {
  let localeFormat = 'en-US'
  if (lng === 'pt') localeFormat = 'pt-br'

  const formatted = dayjs(date).locale(localeFormat).format(format)

  return formatted
}

export function isOlderThan(date: Date, timeAmount: number, timeUnit: ManipulateType): boolean {
  //example: is older than 18 years? => isOlderThan(new Date(), 18, 'year')

  const checkingDate = dayjs(date)
  const pastDate = dayjs().subtract(timeAmount, timeUnit)

  return checkingDate.isBefore(pastDate)
}

export function isPastDate(date: Date): boolean {
  const checkingDate = dayjs(date)

  return checkingDate.isBefore(dayjs())
}
