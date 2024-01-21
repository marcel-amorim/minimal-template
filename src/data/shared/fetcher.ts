import { AxiosError, AxiosRequestConfig } from 'axios'
import { z } from 'zod'

import https from 'https'

import axios from './axios'
import { buildParams } from './buildParams'
import { PAGE_LIMIT } from './constants'
import { FetchError, FetchGenericError, RequestSchemaError, ResponseSchemaError, UnauthorizedAccess } from './errors'
import { DataType, Fetcher, Method, MutationAPI, QueryAPI } from './types'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export const fetcher = async <M extends Method, ResSchema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny, Data extends DataType>(
  options: Fetcher<M, ResSchema, ReqSchema, Data>,
): Promise<z.output<ResSchema>> => {
  try {
    let data: DataType | undefined | null
    let { url } = options
    const params: Record<string, unknown> | undefined = buildParams(options.queryParams ?? {})

    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
      const mutation = options as MutationAPI<M, ResSchema, ReqSchema, Data>

      if (mutation.isRawData) {
        data = mutation.data
      } else {
        let body = mutation.data as unknown as Record<string, unknown>
        if (mutation.transform) body = mutation.transform(body)
        const result = mutation.requestSchema.safeParse(body)

        if (!result.success) {
          return Promise.reject(new RequestSchemaError(result.error, options))
        }
        data = result.data

        url = buildUrl(options.url, mutation.params)
      }
    } else {
      const query = options as QueryAPI<M, ResSchema>
      url = buildUrl(options.url, query.params)
      if (!params.limit) params.limit = PAGE_LIMIT
    }

    const headers = options.headers ?? {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const config: AxiosRequestConfig = {
      url,
      method: options.method,
      httpsAgent,
      headers,
      data,
      params,
      responseType: options.responseType,
    }

    const response = await axios(config)

    if (options.responseSchema) {
      const responseResult = options.responseSchema.safeParse(response.data)
      if (responseResult.success) return Promise.resolve(responseResult.data)

      return Promise.reject(new ResponseSchemaError(responseResult.error, options))
    }

    return Promise.resolve(undefined)
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401 || e.response?.status === 403 || e.response?.data?.error === 'Invalid JWT token') {
        return Promise.reject(new UnauthorizedAccess(e?.response?.data?.message ?? 'Unauthorized. Please provide valid credentials.'))
      }
    }

    if (e instanceof Error) {
      return Promise.reject(new FetchGenericError(e.message, options))
    } else {
      return Promise.reject(new FetchError(e, options))
    }
  }
}

const buildUrl = (url: string, params?: string | string[]) => {
  if (!params) return url

  if (typeof params === 'string') return `${url}/${params}`

  return `${url}/${params.join('/')}`
}
