import { useState, useEffect, useCallback } from 'react'

import { ChildrenProps } from '@@types/children'
import { SplashScreen } from '@lib/loading-screen'
import { useRouter } from '@routes/hooks'
import { paths } from '@routes/paths'

import { useAuthContext } from '../hooks'

export default function AuthGuard({ children }: ChildrenProps) {
  const { loading } = useAuthContext()

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>
}

function Container({ children }: ChildrenProps) {
  const router = useRouter()

  const { authenticated } = useAuthContext()

  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString()

      const href = `${paths.auth.login}?${searchParams}`

      router.replace(href)
    } else {
      setChecked(true)
    }
  }, [authenticated, router])

  useEffect(() => {
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!checked) {
    return null
  }

  return <>{children}</>
}
