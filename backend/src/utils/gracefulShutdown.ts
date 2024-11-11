import { Server } from 'node:http'
import { close } from '../httpServer.js'
import logger from './logger.js'

const gracefulShutdown = async (server: Server): Promise<void> => {
  logger.info('Shutting down gracefully...')

  await close(server)

  logger.info('Shutdown complete. Exiting process.')
  process.exit(0)
}

export default gracefulShutdown
