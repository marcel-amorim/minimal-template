import { z } from 'zod'

import { isValidCPF } from '@data/shared/validators/isValidCPF'
import { isPasswordValid } from '@data/shared/validators/isValidPassword'
import { isOlderThan, parseBrazilianDate } from '@utils/date'

// import { RegisterForm } from './Register'

export const PageSchema = z.object({
  meta: z.object({
    total: z.number(),
    currentPage: z.number(),
    lastPage: z.number(),
    perPage: z.number(),
  }),
})

export const NameSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const DescSchema = z.object({
  id: z.string(),
  description: z.string(),
})

export const CPFSchema = z
  .string()
  .min(14)
  .refine((cpf) => isValidCPF(cpf), {
    params: { i18n: 'error:invalidCPF' },
  })

// took the transform because when user goes back on form
// the value would be transform
export const BrazilianDateSchema = z
  .string()
  .refine((value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value), {
    params: {
      i18n: 'error:invalidBrazilianDate',
    },
  })
  .refine((date) => parseBrazilianDate(date) !== null, {
    params: {
      i18n: 'error:invalidDate',
    },
  })

export const AdultBirthDateSchema = BrazilianDateSchema.refine(
  (birthDate) => {
    const date = parseBrazilianDate(birthDate)

    if (date === null) return false

    return !isOlderThan(date, 120, 'year') && isOlderThan(date, 18, 'year')
  },
  {
    params: { i18n: 'error:invalidAdultAge' },
  },
)

export const PasswordDefinitionSchema = z.string().refine((value) => isPasswordValid(value), {
  params: { i18n: 'error:wrongPassword' },
})

//aceita string | undefined, se string vazia retorna undefined
export const OptionalInput = z
  .string()
  .optional()
  .transform((value) => {
    if (value === '') return undefined

    return value
  })

//aceita string vazia, retorna undefined
export const EmptyInput = z
  .string()
  .length(0)
  .transform(() => {
    return undefined
  })

// export const emptyPerson: RegisterForm = {
//   username: '',
//   email: '',
//   password: '',
//   confirmPassword: '',
//   people: {
//     firstName: '',
//     lastName: '',
//   },
// }

export const ISODateSchema = z.string().datetime()

export const BrazilianDateToISOSchema = BrazilianDateSchema.transform((date) => {
  const isoDate = parseBrazilianDate(date)

  if (isoDate === null) return false
  return isoDate.toISOString()
})

export const LogSchema = {
  createdAt: z.coerce.date().nullish(),
  updatedAt: z.coerce.date().nullish(),
  deletedAt: z.coerce.date().nullish(),
}

export const FindParams = {
  page: z.number().int().positive().nullish().default(1),
  deletedAt: z.boolean().nullish().default(false),
}
