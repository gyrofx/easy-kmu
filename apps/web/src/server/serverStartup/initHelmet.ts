import { opts } from '@/server/config/opts'
import type { Express } from 'express'
import helmet from 'helmet'

export function initHelmet(app: Express) {
  app.disable('x-powered-by')
  app.use(helmet(helmetConfiguration()))
}

function helmetConfiguration() {
  const { auth } = opts()

  const defaults = helmet.contentSecurityPolicy.getDefaultDirectives()
  console.log('defaults', defaults)
  const directives = {
    ...defaults,
    'connect-src': ["'self'", auth.auth0.domain],
    'script-src': ["'self'", 'unsafe-inline'],
    'img-src': ["'self'", 'data:', 'https://authjs.dev'],
  }
  console.log('directives', directives)

  return { contentSecurityPolicy: { directives } }
}
