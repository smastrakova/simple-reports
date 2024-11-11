import { ClientSession } from 'mongoose'
import { FileSummaryResponse } from '../controllers/IReportResponse.js'
import { IFile } from '../db/models/FileDbo.js'
import {
  createFileDbo,
  deleteManyFiles,
  findOneFile
} from '../repositories/fileRepository.js'
import logger from '../utils/logger.js'

export async function fetchFileSummary(
  fileId: string
): Promise<FileSummaryResponse> {
  const file: IFile | null = await findOneFile(fileId, 'name size')

  if (!file) {
    const error = new Error('File not found')
    error.name = 'NotFoundError'
    throw error
  }

  return {
    _id: file._id.toString(),
    name: file.name,
    size: file.sizeInBytes
  }
}

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

export function remoteAttachedFiles(fileIds: string[], session: ClientSession) {
  if (fileIds.length > 0) {
    const deletionResult = deleteManyFiles(fileIds, session)

    if (!deletionResult) {
      const error = new Error('Files not deleted')
      error.name = 'MissingResultError'
      throw error
    }

    logger.debug(`Deleted files with ids: ${fileIds.join(', ')}`)
  }
}
