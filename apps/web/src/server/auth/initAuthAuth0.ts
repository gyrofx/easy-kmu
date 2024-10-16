import type { Express } from 'express'
import { ExpressAuth, type ExpressAuthConfig, getSession } from '@auth/express'
import type { AdapterUser } from '@auth/express/adapters'
import Auth0 from '@auth/express/providers/auth0'
import { opts } from '@/server/config/opts'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { accounts, sessions, users } from '@/server/db/schema/user'
import { db } from '@/server/db/db'
import { decodeJwt } from 'jose'
import { z } from 'zod'

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string
    name?: string | null
    email: string
    image?: string | null
    role?: string | null
  }
}

declare module '@auth/express' {
  interface Session {
    user?: AdapterUser
    expires: string
  }
}

export function initAuthAuth0(app: Express) {
  const adapter = DrizzleAdapter(db(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    // verificationTokensTable: verificationTokens,
  })

  const config: ExpressAuthConfig = {
    // debug: true,
    providers: [
      Auth0({
        clientId: opts().auth.auth0.clientId,
        clientSecret: opts().auth.auth0.clientSecret,
        token: { params: { audience: 'https://ekmu.aq1.ch' } },
        authorization: {
          params: {
            // connection: "google-oauth2",
            scope: 'openid profile email offline_access',
            audience: 'https://ekmu.aq1.ch',
          },
        },
        // profile(profile) {
        //   console.log('profile', { profile })
        //   // return { ...profile, role: profile.permissions[0] ?? 'noRole' }
        //   return profile
        // },
      }),
    ],
    secret: opts().session.secret,
    callbacks: {
      // async signIn(props) {
      //   const { session, token, user } = props
      //   // Send properties to the client, like an access_token from a provider.
      //   // session.accessToken = token.accessToken
      //   console.log('session', { session, token, user })

      //   return session
      // },
      async session(props) {
        const { session } = props
        // Send properties to the client, like an access_token from a provider.
        // session.accessToken = token.accessToken
        // console.log('session', props)

        // session.user.role = user.role
        return session
      },
      async jwt(props) {
        // Send properties to the client, like an access_token from a provider.
        // session.accessToken = token.accessToken
        // console.log('jwt', props)

        return props
      },
    },
    events: {
      async signIn(props) {
        // console.log('event:signIn', { user: props.user, accessToken: props.account?.access_token })
        // props.
        const accessToken = props.account?.access_token
        if (!accessToken) throw new Error('accessToken not found')
        const claims = decodeJwt(accessToken)
        const role = zodClaim.parse(claims)
        // console.log('role', { role })
        if (!adapter.updateUser) throw new Error('updateUser not found')
        const { id } = props.user
        if (!id) throw new Error('id not found')
        await adapter.updateUser({ id, role })
        // decode access_token
        // update profile
      },
      // async session({ session, token }) {
      //   console.log('event:session', { session, token })
      // },
    },
    adapter,
    // adapter: UnstorageAdapter(
    //   createStorage({
    //     driver: redisDriver({
    //       base: 'unstorage',
    //       host: 'localhost',
    //       // tls: true as any,
    //       port: 6379,
    //       // password: 'REDIS_PASSWORD'
    //     }),
    //   }),
    // ),
    // strategy: "jwt"
  }

  // app.set('trust proxy', true)
  app.use(
    '/auth/*',

    ExpressAuth(config),
  )

  app.use(async (req, res, next) => {
    const session = await getSession(req, config)
    res.locals.session = session
    next()
  })
}

const zodClaim = z
  .object({
    permissions: z.array(z.string()),
  })
  .transform((value) => {
    return value.permissions[0] ?? 'noRole'
  })
