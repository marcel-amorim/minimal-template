import { ResponseType } from 'axios'
import { z } from 'zod'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type DataType = Record<string, unknown> | string | Blob | ArrayBuffer

export type QueryOptions<M extends Method, Schema extends z.ZodTypeAny> = {
  url: string
  method: M
  responseSchema?: Schema
  headers?: Record<string, string>
  responseType?: ResponseType
  baseURL?: string
  params?: string | Array<string>
  queryParams?: Params
}

export type MutationOptions<M extends Method, ResSchema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny> = QueryOptions<
  M,
  ResSchema
> & {
  requestSchema: ReqSchema
  transform?: (data: z.output<ReqSchema>) => Record<string, unknown>
  isRawData?: boolean
}

export type QueryAPI<M extends Method, ResSchema extends z.ZodTypeAny> = QueryOptions<M, ResSchema>

export type MutationAPI<
  M extends Method,
  ResSchema extends z.ZodTypeAny,
  ReqSchema extends z.ZodTypeAny,
  Data extends DataType,
> = MutationOptions<M, ResSchema, ReqSchema> & {
  data?: Data
}

export type QueryArgs = {
  params?: Params | string
  queryParams?: Params
  url?: string
}

export type MutationArgs<Data extends DataType> = {
  params?: Params | string
  queryParams?: Params
  request?: Request
  data?: Data
}

export type QueryFetch<M extends Method, ResSchema extends z.ZodTypeAny> = (args?: QueryArgs) => QueryAPI<M, ResSchema>

export type MutationFetch<M extends Method, ResSchema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny, Data extends DataType> = (
  args: Partial<MutationArgs<Data>>,
) => MutationAPI<M, ResSchema, ReqSchema, Data>

export type Fetcher<M extends Method, ResSchema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny, Data extends DataType> =
  | QueryAPI<M, ResSchema>
  | MutationAPI<M, ResSchema, ReqSchema, Data>

export type Params = Record<string, unknown>
export type QueryParams = string | Array<string> | Params
