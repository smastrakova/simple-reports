import { ClientSession } from 'mongoose'
import { IReport, ReportModel } from '../db/models/ReportDbo.js'
import { decode } from '../utils/errorMessageDecoder.js'
import logger from '../utils/logger.js'
import { validateId } from './dataValidator.js'

export async function createReportDbo(
  reporterName: string,
  reporterAge: number,
  headline: string,
  fileId?: string,
  session?: ClientSession
): Promise<IReport> {
  try {
    let files: string[] = []

    if (fileId) {
      validateId(fileId)
      files = [fileId]
    }
    logger.debug('Creating new report')

    const newReport = {
      reporterName,
      reporterAge,
      headline,
      files: files
    }

    if (session) {
      logger.debug('Running query in transaction')
      const createdReports: IReport[] = await ReportModel.create([newReport], {
        session
      })
      return createdReports[0]
    }

    return await ReportModel.create(newReport)
  } catch (error) {
    logger.error(`Error while creating report: ${decode(error)}`)
    throw error
  }
}
