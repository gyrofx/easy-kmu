// see: https://github.com/tjx666/ts-perf-issue?tab=readme-ov-file#solutions
import type { Components, Theme } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

export const createMuiTheme = createTheme as unknown as (
  baseTheme: Theme,
  options?: {
    components: Components<Theme>
  },
) => Theme
