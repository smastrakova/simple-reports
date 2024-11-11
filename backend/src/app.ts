import bodyParser from 'body-parser'
import express, { Express } from 'express'
import { Server } from 'node:http'
import { init } from './httpServer.js'
import gracefulShutdown from './utils/gracefulShutdown.js'

const app: Express = express()

async function start() {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const server: Server = init(app)

  process.on('SIGINT', () => gracefulShutdown(server))
  process.on('SIGTERM', () => gracefulShutdown(server))
}

start()
export { app }
