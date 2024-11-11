import { Express } from 'express'
import { Server } from 'node:http'
import { PORT } from './appConfig.js'
import { decode } from './utils/errorMessageDecoder.js'
import logger from './utils/logger.js'

const port: number = PORT

export function init(app: Express): Server {
  return app.listen(port, (): void => {
    logger.info(`Server is running on http://localhost:${port}`)
  })
}

export async function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error: unknown) => {
      if (error) {
        const errorAsString = decode(error)
        logger.error('Error while closing server:', errorAsString)
        return reject(error)
      }

      logger.info('Server closed')
      resolve()
    })
  })
}
