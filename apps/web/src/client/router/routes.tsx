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

  projects: {
    path: '/projects' as const,
    icon: <Info />,
    text: t().routes.projects,
    maxWidth: 'md' as const,
    title: t().routes.projects,
  },

  project: {
    path: '/project/:projectId' as const,
    icon: <Info />,
    text: t().routes.projects,
    maxWidth: 'md' as const,
    title: t().routes.projects,
  },

  addProjects: {
    id: 'add-projects',
    path: '/add-projects' as const,
    icon: <Info />,
    text: t().routes.addProject,
    maxWidth: 'md' as const,
    title: t().routes.addProject,
  },

  projectOverview: {
    id: 'project-overview',
    path: '/project/:projectId/overview' as const,
    icon: <Info />,
    text: t().routes.projectOverview,
    maxWidth: 'md' as const,
    title: t().routes.projectOverview,
  },

  updateProject: {
    id: 'update-project',
    path: '/project/:projectId/edit' as const,
    icon: <Info />,
    text: t().routes.updateProject,
    maxWidth: 'md' as const,
    title: t().routes.updateProject,
  },

  projectQuotes: {
    id: 'project-quotes',
    path: '/project/:projectId/quotes' as const,
    icon: <Info />,
    text: t().routes.addQuote,
    maxWidth: 'md' as const,
    title: t().routes.addQuote,
  },

  projectInvoices: {
    id: 'project-invoices',
    path: 'invoices' as const,
    icon: <Info />,
    text: t().routes.addQuote,
    maxWidth: 'md' as const,
    title: t().routes.addQuote,
  },

  addQuote: {
    path: '/project/:projectId/add-quote' as const,
    icon: <Info />,
    text: t().routes.addQuote,
    maxWidth: 'md' as const,
    title: t().routes.addQuote,
  },

  updateQuote: {
    path: '/edit-quote/:quoteId' as const,
    icon: <Info />,
    text: t().routes.updateQuote,
    maxWidth: 'md' as const,
    title: t().routes.updateQuote,
  },

  tasks: {
    id: 'project-tasks',
    path: '/project/:projectId/tasks' as const,
    icon: <Info />,
    text: t().routes.tasks,
    maxWidth: 'md' as const,
    title: t().routes.tasks,
  },

  contacts: {
    path: '/contacts' as const,
    icon: <Info />,
    text: t().routes.contacts,
    maxWidth: 'md' as const,
    title: t().routes.contacts,
  },

  objects: {
    path: '/objects' as const,
    icon: <Info />,
    text: t().routes.objects,
    maxWidth: 'md' as const,
    title: t().routes.objects,
  },

  materials: {
    id: 'materials',
    path: '/materials' as const,
    icon: <Info />,
    text: t().routes.materials,
    maxWidth: 'md' as const,
    title: t().routes.materials,
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
