import { opts } from '@/server/config/opts'
import { initLogger } from '@/server/logging/logger'

export function initConfiguredLogger() {
  initLogger(opts().isProduction ? 'production' : 'development')
}
