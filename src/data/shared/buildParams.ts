import { Params } from './types'

export const buildParams = (obj?: Record<string, unknown>): Params => {
  if (!obj) return {}

  const params = {}
  const keys = Object.keys(obj)

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (typeof obj[key] !== 'undefined' && obj[key] !== null && obj[key] !== '') {
      Object.assign(params, { [key as string]: obj[key] })
    }
  }

  return params
}
