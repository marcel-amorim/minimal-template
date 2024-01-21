'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { m } from 'framer-motion'

import { ForbiddenIllustration } from '@assets/illustrations'
import CompactLayout from '@components/organisms/layout/compact-layout'
import { varBounce, MotionContainer } from '@lib/animate'
import { RouterLink } from '@routes/components'

export function Page403() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            No permission
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            The page you&apos;re trying access has restricted access.
            <br />
            Please refer to your system administrator
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Go to Home
        </Button>
      </MotionContainer>
    </CompactLayout>
  )
}
