import { Server } from 'node:http'
import { IDatabaseConnector } from '../db/IDatabaseConnector.js'
import { close } from '../httpServer.js'
import logger from './logger.js'

const gracefulShutdown = async (
  server: Server,
  dbConnector: IDatabaseConnector
): Promise<void> => {
  logger.info('Shutting down gracefully...')

  await dbConnector.disconnectDB()
  await close(server)

  logger.info('Shutdown complete. Exiting process.')
  process.exit(0)
}

export default gracefulShutdown
