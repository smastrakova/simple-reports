import mongoose from 'mongoose'
import { DATABASE_URL } from '../appConfig.js'
import { decode } from '../utils/errorMessageDecoder.js'
import logger from '../utils/logger.js'
import { IDatabaseConnector } from './IDatabaseConnector.js'

export class MongoConnector implements IDatabaseConnector {
  async connectDB(): Promise<void> {
    try {
      logger.debug(`Connecting to ${DATABASE_URL}`)
      await mongoose.connect(DATABASE_URL)
      logger.info('Connected to MongoDB')
    } catch (error: unknown) {
      logger.error(`Failed to connect to MongoDB: ${decode(error)}`)
      process.exit(1)
    }
  }

  async disconnectDB(): Promise<void> {
    try {
      await mongoose.disconnect()
      logger.info('Disconnected from MongoDB')
    } catch (error: unknown) {
      logger.error(`Failed to disconnect from MongoDB: ${decode(error)}`)
      process.exit(1)
    }
  }
}
