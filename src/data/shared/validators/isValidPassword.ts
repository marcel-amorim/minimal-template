import passwordValidator from 'password-validator'

const schema = new passwordValidator()

schema.has().not().spaces().is().min(8).is().max(30).has().uppercase().has().lowercase().has().digits().has().symbols()

export const isPasswordValid = (value: string) => schema.validate(value)
