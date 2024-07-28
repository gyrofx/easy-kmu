import express from 'express'

export function initBodyParserMiddleware(app: express.Express) {
  app.use(express.json({ limit: '10Mb' }))
  app.use(express.urlencoded({ extended: true }))
}
