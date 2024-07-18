import { Info } from '@mui/icons-material'
import { t } from '@/client/i18n/t'

export const routes = {
  home: {
    path: '/' as const,
    text: t().routes.home,
    maxWidth: 'md' as const,
    title: t().routes.home,
    protected: true,
  },

  signIn: {
    path: '/sign-in' as const,
    text: t().routes.signIn,
    maxWidth: 'md' as const,
    title: t().routes.signIn,
  },

  invoice: {
    path: '/invoice' as const,
    icon: <Info />,
    text: t().routes.invoice,
    maxWidth: 'md' as const,
    title: t().routes.invoice,
  },

  contacts: {
    path: '/contacts' as const,
    icon: <Info />,
    text: t().routes.contacts,
    maxWidth: 'md' as const,
    title: t().routes.contacts,
  },

  about: {
    path: '/about' as const,
    icon: <Info />,
    text: t().routes.about,
    maxWidth: 'md' as const,
    title: t().routes.about,
  },

  settings: {
    path: '/settings' as const,
    icon: <Info />,
    text: t().routes.settings,
    maxWidth: 'md' as const,
    title: t().routes.settings,
    protected: true,
  },
}
