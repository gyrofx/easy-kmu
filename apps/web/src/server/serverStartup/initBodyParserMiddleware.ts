import express from 'express'

export function initBodyParserMiddleware(app: express.Express) {
  app.use(express.json({ limit: '100kb' }))
  app.use(express.urlencoded({ extended: true }))
}
