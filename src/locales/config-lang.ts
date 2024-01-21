'use client'

// core
import { enUS as enUSCore, ptBR as ptBRCore } from '@mui/material/locale'
// data-grid
import { enUS as enUSDataGrid, ptBR as ptBRDataGrid } from '@mui/x-data-grid'
// date-pickers
import { enUS as enUSDate, ptBR as ptBRDate } from '@mui/x-date-pickers/locales'
import { ptBR as ptBRAdapter, enUS as enUSAdapter } from 'date-fns/locale'
import merge from 'lodash/merge'

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  {
    label: 'Portuguese',
    value: 'pt',
    systemValue: merge(ptBRDate, ptBRDataGrid, ptBRCore),
    adapterLocale: ptBRAdapter,
    icon: 'flagpack:br',
  },
]

export const defaultLang = allLangs[1] // Portuguese

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
