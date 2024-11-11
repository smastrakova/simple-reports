import { ClientSession } from 'mongoose'
import { FileModel, IFile } from '../db/models/FileDbo.js'
import { decode } from '../utils/errorMessageDecoder.js'
import logger from '../utils/logger.js'

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
