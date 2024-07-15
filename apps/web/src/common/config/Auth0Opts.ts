export interface Auth0Opts {
  readonly secret: string
  readonly domain: string
  readonly clientId: string
  readonly clientSecret: string
  readonly scope: string
  readonly audience: string
  readonly redirectUrl: string
}
