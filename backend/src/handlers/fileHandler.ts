import { ClientSession } from 'mongoose'
import { IFile } from '../db/models/FileDbo.js'
import { createFileDbo } from '../repositories/fileRepository.js'
import logger from '../utils/logger.js'

export async function storeFile(
  file: Express.Multer.File,
  session?: ClientSession
): Promise<IFile> {
  logger.debug('Found file attached to report, will store it as well')

  return createFileDbo(
    file.buffer,
    file.originalname,
    file.size,
    file.mimetype,
    session
  )
}
