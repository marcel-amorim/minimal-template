import { Params } from '@data/shared/types'

export const getSearchParamsFromUrl = (url: string): Params => {
  const urlObj = new URL(url)

  const params = {}
  urlObj.searchParams.forEach((value, key) => Object.assign(params, { [key]: value }))

  return params
}

export const getSearchParams = (request: Request): Params => {
  return getSearchParamsFromUrl(request.url)
}

export const getParams = (params: Record<string, unknown> | string): string | string[] => {
  if (typeof params === 'string') return params
  return Object.values(params)
    .filter((p) => Boolean(p))
    .map((p) => String(p)) as string[]
}
