import { ClientSession } from 'mongoose'
import { IFile } from '../db/models/FileDbo.js'
import { IReport } from '../db/models/ReportDbo.js'
import { createReportDbo } from '../repositories/reportRepository.js'
import logger from '../utils/logger.js'
import { storeFile } from './fileHandler.js'
import { withTransaction } from './transactionWrapper.js'

const createReportTransactional = async (
  session: ClientSession,
  reporterName: string,
  reporterAge: number,
  headline: string,
  file?: Express.Multer.File
): Promise<IReport> => {
  let fileId
  if (file) {
    const createdFile: IFile | undefined | null = file
      ? await storeFile(file, session)
      : null

    if (!createdFile) {
      const error = new Error('File not found')
      error.name = 'NotFoundError'
      throw error
    }

    logger.debug(`Successfully created new file \'${createdFile.name}\'`)
    fileId = createdFile._id.toString()
  }

  const createdReport: IReport = await createReportDbo(
    reporterName,
    reporterAge,
    headline,
    fileId,
    session
  )

  if (!createdReport) {
    const error = new Error('Report not saved')
    error.name = 'MissingResultError'
    throw error
  }

  return createdReport
}

export const createNewReport = async (
  reporterName: string,
  reporterAge: number,
  headline: string,
  file?: Express.Multer.File
): Promise<IReport> => {
  return await withTransaction((session) =>
    createReportTransactional(
      session,
      reporterName,
      reporterAge,
      headline,
      file
    )
  )
}
