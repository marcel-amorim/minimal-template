/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { AxiosError } from 'axios'
import { z } from 'zod'

export class UnauthorizedAccess extends Error {}

export class FetchError extends Error {
  error: AxiosError

  extra: Record<string, unknown>

  constructor(error: AxiosError, options: Record<string, unknown>) {
    let { message } = error

    const errorResponse = error.response?.data
      ? (error.response?.data as Record<string, any>).message ?? (error.response?.data as Record<string, any>).error
      : undefined
    if (errorResponse) {
      if (Array.isArray(errorResponse)) {
        message = errorResponse.map((err: any) => `${err.path.join(', ')} - ${err.message}`).join(' | ')
      } else {
        message = errorResponse
      }
    } else {
      const errorMessage = error.response?.data ? (error.response?.data as Record<string, any>).message : undefined

      if (errorMessage) message = errorMessage
      else if (error.response?.status) {
        message = `Request failed with status ${error.response?.status}.`
        switch (error.response?.status) {
          case 400:
            message = 'Bad request. Please check your request parameters.'
            break
          case 401:
            message = 'Unauthorized. Please provide valid credentials.'
            break
          case 404:
            message = 'Resource not found. Please check your URL.'
            break
          case 500:
            message = 'Internal server error. Please try again later.'
            break
          default:
            break
        }
      }
    }

    super(message)
    this.error = error
    this.extra = options
  }
}

export class RequestSchemaError extends Error {
  error: z.ZodError

  extra: Record<string, unknown>

  constructor(error: z.ZodError, options: Record<string, unknown>) {
    super(error.message)
    this.error = error
    this.extra = options
  }
}

export class ResponseSchemaError extends Error {
  error!: z.ZodError

  extra: Record<string, unknown>

  constructor(error: z.ZodError, options: Record<string, unknown>) {
    super(error.message)
    this.error = error
    this.extra = options
  }
}

export class FetchGenericError extends Error {
  extra: Record<string, unknown>

  constructor(message: string, options: Record<string, unknown>) {
    super(message)
    this.extra = options
  }
}
