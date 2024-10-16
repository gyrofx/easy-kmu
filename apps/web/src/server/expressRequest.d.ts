import { AuthInfo } from '@trackops/common'

declare global {
  namespace Express {
    interface Request {
      auth?: AuthInfo
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    data: unknown
  }
}

export {}
