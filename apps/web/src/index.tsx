import { createRoot } from 'react-dom/client'
import './index.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@fontsource/inter'
import { App } from '@/client/App'

// let theme = createTheme()
// theme = responsiveFontSizes(theme)

const container = document.getElementById('root')
if (!container) throw new Error('No container element')
const root = createRoot(container)

root.render(<App />)
