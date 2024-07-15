export type HTTPSOpts = HTTPSOptsSet | HTTPSOptsUnset

export interface HTTPSOptsUnset {
  readonly enabled: false
}

export interface HTTPSOptsSet {
  readonly enabled: true
  readonly sslKeyFile: string
  readonly sslCertFile: string
  readonly sslCaFile?: string
}
