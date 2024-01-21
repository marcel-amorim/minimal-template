import { useEffect, useCallback } from 'react'

import { ChildrenProps } from '@@types/children'
import { SplashScreen } from '@lib/loading-screen'
import { useRouter, useSearchParams } from '@routes/hooks'
import { paths } from '@routes/paths'

import { useAuthContext } from '../hooks'

export default function GuestGuard({ children }: ChildrenProps) {
  const { loading } = useAuthContext()

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>
}

function Container({ children }: ChildrenProps) {
  const router = useRouter()

  const searchParams = useSearchParams()

  const returnTo = searchParams.get('returnTo') || paths.home

  const { authenticated } = useAuthContext()

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo)
    }
  }, [authenticated, returnTo, router])

  useEffect(() => {
    check()
  }, [check])

  return <>{children}</>
}
