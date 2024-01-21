import { endpoints } from '@data/shared/endpoints'
import { paths } from '@routes/paths'

import axios from '../../shared/axios'

export const TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'
export const USER_ID_KEY = 'userId'

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false
  }

  const decoded = jwtDecode(accessToken)

  const currentTime = Date.now() / 1000

  return decoded.exp > currentTime
}

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer

  const currentTime = Date.now()

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime

  clearTimeout(expiredTimer)

  expiredTimer = setTimeout(() => {
    if (!refreshAccessToken()) {
      sessionStorage.removeItem(TOKEN_KEY)

      window.location.href = paths.auth.login
    }
  }, timeLeft)
}

export const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) return null

  try {
    const res = await axios.post(endpoints.auth.refresh, { refresh_token: refreshToken })

    const { access_token: newAccessToken } = res.data

    setSession(newAccessToken)
    return newAccessToken
  } catch {
    return null
  }
}

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem(TOKEN_KEY, accessToken)

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken) // ~3 days by minimals server
    tokenExpired(exp)
  } else {
    sessionStorage.removeItem(TOKEN_KEY)

    delete axios.defaults.headers.common.Authorization
  }
}
