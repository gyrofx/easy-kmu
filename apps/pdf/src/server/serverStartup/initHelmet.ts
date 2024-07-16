import type { Express } from 'express'
import helmet from 'helmet'

export function initHelmet(app: Express) {
  app.disable('x-powered-by')
  app.use(helmet())
}
