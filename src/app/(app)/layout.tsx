'use client'

import { ChildrenProps } from '@@types/children'
import AppLayout from '@components/organisms/layout/app'

export default function Layout({ children }: ChildrenProps) {
  return <AppLayout>{children}</AppLayout>
}
