import { ClientSession } from 'mongoose'
import { IFile } from '../db/models/FileDbo.js'
import { IReport } from '../db/models/ReportDbo.js'
import {
  createReportDbo,
  findAndDeleteReport,
  findOneReport,
  findOneReturnFields,
  saveReport
} from '../repositories/reportRepository.js'
import logger from '../utils/logger.js'
import { remoteAttachedFiles, storeFile } from './fileHandler.js'
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

const updateReportTransactional = async (
  session: ClientSession,
  reportId: string,
  reporterName: string,
  reporterAge: number,
  headline: string,
  file?: Express.Multer.File
): Promise<IReport> => {
  const reportDb: IReport | null = await findOneReport(reportId, session)

  if (!reportDb) {
    const error = new Error('Report not found')
    error.name = 'NotFoundError'
    throw error
  }

  if (reporterName) reportDb.reporterName = reporterName
  if (reporterAge) reportDb.reporterAge = reporterAge
  if (headline) reportDb.headline = headline

  if (file) {
    remoteAttachedFiles(reportDb.files, session)

    if (file.size > 0) {
      const newFile: IFile | undefined | null = file
        ? await storeFile(file, session)
        : null

      if (!newFile) {
        const error = new Error('File not stored')
        error.name = 'MissingResultError'
        throw error
      }

      reportDb.files = [newFile._id.toString()]
    } else {
      reportDb.files = []
    }
  }

  const updatedReport: IReport | null = await saveReport(reportDb, session)
  if (!updatedReport) {
    const error = new Error('Report not saved')
    error.name = 'MissingResultError'
    throw error
  }
  logger.debug(`Successfully updated report \'${updatedReport}\'`)
  return updatedReport
}

export const updateReportFields = async (
  reportId: string,
  reporterName: string,
  reporterAge: number,
  headline: string,
  file?: Express.Multer.File
): Promise<IReport> => {
  return await withTransaction((session) =>
    updateReportTransactional(
      session,
      reportId,
      reporterName,
      reporterAge,
      headline,
      file
    )
  )
}

const deleteReportTransactional = async (
  session: ClientSession,
  reportId: string
): Promise<IReport> => {
  const report: IReport | null = await findOneReturnFields(
    reportId,
    'files',
    session
  )
  if (!report) {
    const error = new Error('Report not found')
    error.name = 'NotFoundError'
    throw error
  }

  remoteAttachedFiles(report.files, session)

  const deletedReport: IReport | null = await findAndDeleteReport(reportId)
  if (!deletedReport) {
    const error = new Error('Report not deleted')
    error.name = 'MissingResultError'
    throw error
  }

  logger.debug(`Deleted report with id \'${deletedReport._id.toString()}\'`)
  return deletedReport
}

export const removeReport = async (reportId: string): Promise<IReport> => {
  return await withTransaction((session) =>
    deleteReportTransactional(session, reportId)
  )
}
