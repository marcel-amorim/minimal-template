import { z } from 'zod'

import { getParams, getSearchParamsFromUrl } from '@data/shared/getParams'
import { QueryOptions, MutationOptions, Method, QueryFetch, MutationFetch, QueryArgs, MutationArgs, DataType } from '@data/shared/types'

export function buildApiRoute<M extends Method, Schema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny, Data extends DataType>(
  options: MutationOptions<M, Schema, ReqSchema>,
): MutationFetch<M, Schema, ReqSchema, Data>

export function buildApiRoute<M extends Method, Schema extends z.ZodTypeAny>(options: QueryOptions<M, Schema>): QueryFetch<M, Schema>

export function buildApiRoute<M extends Method, Schema extends z.ZodTypeAny, ReqSchema extends z.ZodTypeAny, Data extends DataType>(
  options: QueryOptions<M, Schema> | MutationOptions<M, Schema, ReqSchema>,
): QueryFetch<M, Schema> | MutationFetch<M, Schema, ReqSchema, Data> {
  if ('requestSchema' in options) {
    return (args: Partial<MutationArgs<Data>>) => ({
      ...options,
      ...args,
      params: args.params ? getParams(args.params) : undefined,
    })
  }

  return (args?: QueryArgs) => {
    const queryOptions = { ...options }

    if (args?.params) {
      Object.assign(queryOptions, {
        params: typeof args.params === 'string' ? args.params : getParams(args.params),
      })
    }

    if (args?.url) {
      Object.assign(queryOptions, {
        queryParams: {
          ...getSearchParamsFromUrl(args.url),
          ...args?.queryParams,
        },
      })
    } else if (args?.queryParams) {
      Object.assign(queryOptions, { queryParams: args.queryParams })
    }

    return queryOptions
  }
}
