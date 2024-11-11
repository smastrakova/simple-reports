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

export async function findAllReports(
  pageNumber: number,
  limitNumber: number
): Promise<IReport[]> {
  try {
    return await ReportModel.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
  } catch (error) {
    logger.error(`Error while finding all reports: ${decode(error)}`)
    throw error
  }
}

export async function findOneReturnFields(
  id: string,
  fieldsToSelect: string,
  session?: ClientSession
): Promise<IReport | null> {
  try {
    validateId(id)

    logger.debug(`Fetching single report with id \'${id}\'`)

    const findQuery = { _id: id }

    if (session) {
      logger.debug('Running query in transaction')
      return await ReportModel.findOne(findQuery, fieldsToSelect).session(
        session
      )
    }

    return await ReportModel.findOne(findQuery, fieldsToSelect)
  } catch (error) {
    logger.error(`Error while fetching single report: ${decode(error)}`)
    throw error
  }
}

export async function findOneReport(
  id: string,
  session?: ClientSession
): Promise<IReport | null> {
  try {
    validateId(id)

    logger.debug(`Fetching single report with id \'${id}\'`)

    const findQuery = { _id: id }

    if (session) {
      logger.debug('Running query in transaction')
      return await ReportModel.findOne(findQuery).session(session)
    }

    return await ReportModel.findOne(findQuery)
  } catch (error) {
    logger.error(`Error while fetching single report: ${decode(error)}`)
    throw error
  }
}

export async function saveReport(
  report: IReport,
  session?: ClientSession
): Promise<IReport | null> {
  try {
    logger.debug(`Saving report`)

    report.lastUpdate = new Date()
    if (session) {
      logger.debug('Running query in transaction')
      return await report.save({ session })
    }

    return await report.save()
  } catch (error) {
    logger.error(`Error while saving report: ${decode(error)}`)
    throw error
  }
}

export async function findAndDeleteReport(id: string): Promise<IReport | null> {
  try {
    validateId(id)

    logger.debug(`Deleting report with id ${id}`)

    return await ReportModel.findByIdAndDelete(id)
  } catch (error) {
    logger.error(`Error while removing report: ${decode(error)}`)
    throw error
  }
}

export async function countReports(): Promise<number> {
  try {
    logger.debug('Counting all reports in collection')

    return await ReportModel.countDocuments()
  } catch (error) {
    logger.error(`Error while counting all reports: ${decode(error)}`)
    throw error
  }
}
