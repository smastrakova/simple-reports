import mongoose, { ClientSession } from 'mongoose'
import { decode } from '../utils/errorMessageDecoder.js'
import logger from '../utils/logger.js'

export async function withTransaction<T>(
  transactionFunction: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session: ClientSession = await mongoose.startSession()

  try {
    session.startTransaction()
    const result: Awaited<T> = await transactionFunction(session)
    await session.commitTransaction()
    logger.debug('Transaction committed successfully')

    return result
  } catch (error) {
    await session.abortTransaction()
    logger.error('Transaction aborted due to error:', decode(error))
    throw error
  } finally {
    await session.endSession()
  }
}
