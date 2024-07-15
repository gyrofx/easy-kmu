import type { Express } from 'express'
import session from 'express-session'

export function initSessionManager(app: Express) {
  app.use(
    session({
      secret: 'qEas5ns3gxl41G',
      cookie: { maxAge: 86400000, secure: true },
      resave: false,
      saveUninitialized: true,
      // store,
    }),
  )

  // app.get('/api/authenticate', (req, res) => {
  //   console.log('authenticate API')
  //   authenticateWithJwt(req)
  //   res.redirect(303, '/')
  //   // res.sendStatus(200)
  // })
}
