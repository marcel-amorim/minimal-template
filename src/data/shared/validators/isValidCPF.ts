export function isValidCPF(cpf: string) {
  const cleanCPF = cpf.replace(/\D/g, '') // Remove non-numeric characters

  // CPF must have 11 digits
  if (cleanCPF.length !== 11) {
    return false
  }

  // CPF should not consist of the same digit repeated
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return false
  }

  // Calculate validation digits using CPF algorithm
  const wholeCPF = cleanCPF.split('').map(Number)

  const digits = wholeCPF.slice(0, 9)

  const givenD1 = wholeCPF[9]
  const givenD2 = wholeCPF[10]

  let sum1 = 0
  let sum2 = 0

  // Validate d1
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i)
  }

  const rest1 = sum1 % 11

  const calculatedD1 = rest1 < 2 ? 0 : 11 - rest1

  if (calculatedD1 !== givenD1) return false

  // Validate d2
  for (let i = 0; i < 9; i++) {
    sum2 += digits[i] * (11 - i)
  }
  sum2 += calculatedD1 * 2

  const rest2 = sum2 % 11

  const calculatedD2 = rest2 < 2 ? 0 : 11 - rest2

  if (calculatedD2 !== givenD2) return false

  // passed all tests,cpf is valid
  return true
}
