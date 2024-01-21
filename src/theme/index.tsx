'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeOptions, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import merge from 'lodash/merge'
import { useMemo } from 'react'

import { useSettingsContext } from '@lib/settings'
import { useLocales } from 'src/locales'

// system
import { customShadows } from './custom-shadows'
import NextAppDirEmotionCacheProvider from './next-emotion-cache'
import { createContrast } from './options/contrast'
import { createPresets } from './options/presets'
import RTL from './options/right-to-left'
import { componentsOverrides } from './overrides'
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'
// options

type Props = {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales()

  const settings = useSettingsContext()

  const presets = createPresets(settings.themeColorPresets)

  const contrast = createContrast(settings.themeContrast, settings.themeMode)

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      direction: settings.themeDirection,
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [settings.themeMode, settings.themeDirection, presets.palette, presets.customShadows, contrast.palette],
  )

  const theme = createTheme(memoizedValue as ThemeOptions)

  theme.components = merge(componentsOverrides(theme), contrast.components)

  const themeWithLocale = useMemo(() => createTheme(theme, currentLang.systemValue), [currentLang.systemValue, theme])

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <MuiThemeProvider theme={themeWithLocale}>
        <RTL themeDirection={settings.themeDirection}>
          <CssBaseline />
          {children}
        </RTL>
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  )
}
