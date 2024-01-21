import AppBar from '@mui/material/AppBar'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { memo } from 'react'

import { NavSectionHorizontal } from '@lib/nav-section'
import Scrollbar from '@lib/scrollbar'
import { useMockedUser } from 'src/hooks/use-mocked-user'
import { bgBlur } from 'src/theme/css'

import { HEADER } from '../common/config-layout'
import { HeaderShadow } from '../common/header-shadow'

import { useNavData } from './config-navigation'

function NavHorizontalRoot() {
  const theme = useTheme()

  const { user } = useMockedUser()

  const navData = useNavData()

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: user?.role,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  )
}

export const NavHorizontal = memo(NavHorizontalRoot)
