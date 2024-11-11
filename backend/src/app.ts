import bodyParser from 'body-parser'
import express, { Express } from 'express'
import { Server } from 'node:http'
import { IDatabaseConnector } from './db/IDatabaseConnector.js'
import { MongoConnector } from './db/MongoConnector.js'
import { init } from './httpServer.js'
import gracefulShutdown from './utils/gracefulShutdown.js'

const app: Express = express()
const dbConnector: IDatabaseConnector = new MongoConnector()

async function start() {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  dbConnector.connectDB()

  const server: Server = init(app)

  process.on('SIGINT', () => gracefulShutdown(server, dbConnector))
  process.on('SIGTERM', () => gracefulShutdown(server, dbConnector))
}

start()
export { app }
