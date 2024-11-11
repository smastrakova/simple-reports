import { ClientSession, DeleteResult } from 'mongoose'
import { FileModel, IFile } from '../db/models/FileDbo.js'
import { decode } from '../utils/errorMessageDecoder.js'
import logger from '../utils/logger.js'
import { validateId } from './dataValidator.js'

export async function createFileDbo(
  data: Buffer,
  name: string,
  sizeInBytes: number,
  mimeType: string,
  session?: ClientSession
): Promise<IFile> {
  try {
    const newFile = {
      data,
      name,
      sizeInBytes,
      mimeType
    }

    if (session) {
      logger.debug('Running query in transaction')
      const createdFiles: IFile[] = await FileModel.create([newFile], {
        session
      })

      return createdFiles[0]
    }

    return await FileModel.create(newFile)
  } catch (error) {
    logger.error('Error while creating report file:', decode(error))
    throw error
  }
}

export async function deleteManyFiles(
  fileIds: string[],
  session?: ClientSession
): Promise<DeleteResult> {
  try {
    fileIds.map((id) => validateId(id))

    const deleteQuery = {
      _id: { $in: fileIds }
    }

    if (session) {
      logger.debug('Running query in transaction')
      return await FileModel.deleteMany(deleteQuery).session(session)
    }

    return await FileModel.deleteMany(deleteQuery)
  } catch (error) {
    logger.error('Error while removing report files', decode(error))
    throw error
  }
}
