'use client'

import { QueryClient, QueryClientProvider } from 'react-query'

type Props = {
  children: React.ReactNode
}

export const queryClient = new QueryClient()

export const QueryClientContextProvider = ({ children }: Props) => {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
