import { auth } from 'express-openid-connect'
import type { Express } from 'express'
import { opts } from '@/server/config/opts'

export function initOpenIdConnect(app: Express) {
  const { auth0 } = opts().auth

  console.log('initOpenIdConnect', { auth0 })

  const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'https://worklog.localhost:3000',
    clientID: auth0.clientId,
    clientSecret: auth0.clientSecret,
    issuerBaseURL: `https://${auth0.domain}`,
    routes: { callback: 'auth/authenticate', login: 'auth/login', logout: 'auth/logout' },
    secret: auth0.secret,
    authorizationParams: {
      response_type: 'code',
      audience: 'https://worklog.aq1.ch',
      scope: 'openid profile email offline_access',
    },

    // cookie
    // session: {
    //   name: 'JZ_SC_SESSION',
    //   rolling: false,
    //   absoluteDuration: 20 * 60 * 60,
    //   store: new RedisStore({ client: serverRedis() }),
    //   cookie: {
    //     secure: true,
    //     domain: 'worklog.localhost',
    //     // originalMaxAge: 20 * 60 * 60
    //   },
    // },
  }

  app.use(auth(config))
}
