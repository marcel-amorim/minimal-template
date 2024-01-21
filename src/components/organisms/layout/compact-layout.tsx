import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import { ChildrenProps } from '@@types/children'

import { HeaderSimple } from './common/header-simple'

export default function CompactLayout({ children }: ChildrenProps) {
  return (
    <>
      <HeaderSimple />

      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth: 400,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Stack>
      </Container>
    </>
  )
}
