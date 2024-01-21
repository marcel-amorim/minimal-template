'use client'

import { useMemo, useEffect, useReducer, useCallback } from 'react'

import { ChildrenProps } from '@@types/children'
import axios from '@data/shared/axios'
import { endpoints } from '@data/shared/endpoints'

import { AuthUserType, ActionMapType, AuthStateType } from '../types'

import { AuthContext } from './auth-context'
import { setSession, isValidToken, TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, refreshAccessToken } from './utils'

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType
  }
  [Types.LOGIN]: {
    user: AuthUserType
  }
  [Types.REGISTER]: {
    user: AuthUserType
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
  user: null,
  loading: true,
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    }
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    }
  }
  return state
}

export function AuthProvider({ children }: ChildrenProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(TOKEN_KEY)
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
      const userId = sessionStorage.getItem(USER_ID_KEY)

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken)

        const res = await axios.get(endpoints.auth.users, { params: { id: userId } })

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...res.data,
              accessToken,
              refreshToken,
            },
          },
        })
      } else if (refreshToken) {
        const newAccessToken = await refreshAccessToken()

        if (!newAccessToken) throw new Error('Invalid refresh token')

        const resUser = await axios.get(endpoints.auth.users, { params: { id: userId } })

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...resUser.data,
              accessToken: newAccessToken,
            },
          },
        })
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        })
      }
    } catch (error) {
      console.error(error)
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      })
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    }

    const res = await axios.post(endpoints.auth.login, data)

    const { access_token: accessToken, user, refresh_token: refreshToken } = res.data

    setSession(accessToken)
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    sessionStorage.setItem(USER_ID_KEY, user.id)

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          accessToken,
          refreshToken,
        },
      },
    })
  }, [])

  // REGISTER
  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    }

    const res = await axios.post(endpoints.auth.users, data)

    const { accessToken, user } = res.data

    sessionStorage.setItem(TOKEN_KEY, accessToken)

    dispatch({
      type: Types.REGISTER,
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    })
  }, [])

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(USER_ID_KEY)
    dispatch({
      type: Types.LOGOUT,
    })
  }, [])

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'

  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status],
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}
