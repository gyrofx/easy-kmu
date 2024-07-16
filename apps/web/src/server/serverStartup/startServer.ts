import express from 'express'
import { initStaticFiles, setupSinglePageApp } from '@/server/serverStartup/staticFiles'
import { initHelmet } from '@/server/serverStartup/initHelmet'
import { initBodyParserMiddleware } from '@/server/serverStartup/initBodyParserMiddleware'
import { readFileSync } from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createHttpsServer, type ServerOptions as NodeServerOptions } from 'node:https'
import type { HTTPSOpts } from '@/server/config/HTTPSOpts'
import type { NodeServer } from '@/server/serverStartup/NodeServer'
import { initConfiguredLogger } from '@/server/logging/initConfiguredLogger'
import { opts } from '@/server/config/opts'
import { logger } from '@/server/logging/logger'
import { unknownAsError } from '@easy-kmu/common'
import type { Express } from 'express'
import { serverInitRedis } from '@/server/redis/initRedis'
// import { initOpenIdConnect } from '@/server/auth/initOpenIdConnect'
import { initApi } from '@/server/api/initApi'

export async function startServer() {
  initConfiguredLogger()
  try {
    logger().debug('Starting server', { opts: opts() })
    // logOptsForProductionStartupInspection(opts())
    return await startServerInner()
  } catch (err) {
    logger().error('Error during server startup', unknownAsError(err))
    process.exit(1)
  }
}

async function startServerInner() {
  const app = express()
  const httpServer = createServer(app, opts())

  serverInitRedis(opts().redisUrl)
  initHelmet(app)
  initBodyParserMiddleware(app)
  // initOpenIdConnect(app)
  initApi(app)
  // initSessionManager(app)
  // initServerInfo(app)
  initStaticFiles(app)

  await setupSinglePageApp(app)
  // respondWithError(app)

  listenToServer(httpServer, opts())
  return httpServer
}

export interface ServerOptions {
  https: HTTPSOpts
  port: number
  host: string
}

export function createServer(app: Express, options: ServerOptions) {
  return options.https.enabled ? createHttpsServer(httpsOptions(options), app) : createHttpServer(app)
}

export function listenToServer(httpServer: NodeServer, options: ServerOptions) {
  const listenOptions = httpListenOptions(options)
  const address = serverAddress(options)
  if (!localhost(options)) logger().info('Starting server', { address })
  httpServer.listen(listenOptions, () => logger().info('Server listening', { address }))
}

function localhost(options: ServerOptions) {
  return options.host.endsWith('.localhost')
}

export function httpsOptions(options: ServerOptions): NodeServerOptions {
  const config = options.https
  if (!config.enabled) {
    throw new Error('Invalid HTTPS config')
  }

  const key = readFileSync(config.sslKeyFile)
  const cert = readFileSync(config.sslCertFile)
  return { key, cert }
}

function httpListenOptions({ port }: ServerOptions) {
  return { port }
}

function serverAddress(options: ServerOptions) {
  return `http${options.https.enabled ? 's' : ''}://${options.host || '*'}:${options.port}`
}
