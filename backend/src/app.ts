import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import { Server } from 'node:http'
import { IDatabaseConnector } from './db/IDatabaseConnector.js'
import { MongoConnector } from './db/MongoConnector.js'
import { init } from './httpServer.js'
import reportsRouter from './routes/reports.js'
import {
  clientErrorHandler,
  errorHandler,
  logErrors
} from './utils/errorHandler.js'
import gracefulShutdown from './utils/gracefulShutdown.js'

const app: Express = express()
const dbConnector: IDatabaseConnector = new MongoConnector()

async function start() {
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))

  dbConnector.connectDB()

  const server: Server = init(app)

  app.use('/reports', reportsRouter)
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  process.on('SIGINT', () => gracefulShutdown(server, dbConnector))
  process.on('SIGTERM', () => gracefulShutdown(server, dbConnector))
}

start()
export { app }
