'use client'

import { ChildrenProps } from '@@types/children'
import { AuthLayout } from '@components/organisms/layout/auth-layout'
import { GuestGuard } from '@data/auth/guard'

export default function Layout({ children }: ChildrenProps) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  )
}
