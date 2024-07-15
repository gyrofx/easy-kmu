import type { User } from '@prisma/client'

declare module '@karmaniverous/serify-deserify' {
  let createReduxMiddleware: (options: any) => any
  let deserify: <T>(obj: any) => T
  let serify: <T>(obj: any) => T
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
