import { readFile } from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import { opts } from '@/server/config/opts'

const buildDir = path.join(`${process.cwd()}/build`)

export function initStaticFiles(app: express.Express) {
  app.use(express.static(buildDir))
}

export async function setupSinglePageApp(app: express.Express) {
  const fileContents = await indexHtmlContents()
  app.get('/*', (_req, res) => res.setHeader('Content-Type', 'text/html').send(fileContents))
}

export async function indexHtmlContents() {
  try {
    const filePath = path.join(buildDir, 'index.html')
    return await readFile(filePath)
  } catch (error) {
    if (opts().isProduction) throw error
    return ''
  }
}
