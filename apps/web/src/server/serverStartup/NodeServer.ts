import type { Server as HttpServer } from 'node:http'
import type { Server as HttpsServer } from 'node:https'

export type NodeServer = HttpsServer | HttpServer
