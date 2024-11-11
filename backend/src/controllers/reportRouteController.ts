import { Request, Response } from 'express'
import { IReport } from '../db/models/ReportDbo.js'
import { fetchFileSummary } from '../handlers/fileHandler.js'
import {
  createNewReport,
  removeReport,
  updateReportFields
} from '../handlers/reportHandler.js'
import {
  countReports,
  findAllReports,
  findOneReport
} from '../repositories/reportRepository.js'
import logger from '../utils/logger.js'
import {
  convertToDetail,
  convertToSummary,
  FileSummaryResponse,
  ReportSummaryResponse
} from './IReportResponse.js'

export const getReports = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query
  const pageNumber: number = Number(page)
  const limitNumber: number = Number(limit)

  const [reports, totalReports] = await getAllReports(pageNumber, limitNumber)

  res.status(200).json({
    total: totalReports,
    page: pageNumber,
    pageSize: limitNumber,
    totalPages: Math.ceil(totalReports / limitNumber),
    reports: reports
  })
  return
}

export const getReportSummary = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query
  const pageNumber: number = Number(page)
  const limitNumber: number = Number(limit)

  const [reportsData, totalReports] = await getAllReports(
    pageNumber,
    limitNumber
  )
  const reports: ReportSummaryResponse[] = reportsData.map(convertToSummary)

  res.status(200).json({
    total: totalReports,
    page: pageNumber,
    pageSize: limitNumber,
    totalPages: Math.ceil(totalReports / limitNumber),
    reports: reports
  })
  return
}

async function getAllReports(pageNumber: number, limitNumber: number) {
  logger.debug('Retrieving all reports.')

  return await Promise.all([
    findAllReports(pageNumber, limitNumber),
    countReports()
  ])
}

export const getSingleReport = async (req: Request, res: Response) => {
  const { id } = req.params
  logger.debug(`Fetching report with id ${id}`)

  const report: IReport | null = await findOneReport(id)
  if (!report) {
    const error = new Error('Report not found')
    error.name = 'NotFoundError'
    throw error
  }

  const findFilesPromises: Promise<FileSummaryResponse>[] =
    report.files.map(fetchFileSummary)

  const storedFiles: FileSummaryResponse[] = (
    await Promise.all(findFilesPromises)
  ).filter((file) => file != null)

  res.status(200).json(convertToDetail(report, storedFiles))
  return
}

export const createReport = async (req: Request, res: Response) => {
  const createdReport: IReport = await createNewReport(
    req.body.reporterName,
    req.body.reporterAge,
    req.body.headline,
    req.file
  )

  res.status(201).json(createdReport)
  return
}

export const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params
  const deletionResult: IReport = await removeReport(id)

  logger.debug(`Deleted report with id ${id}`)
  res.status(204).json(deletionResult)
  return
}

export const updateReport = async (req: Request, res: Response) => {
  const { id } = req.params
  logger.debug(`Updating report with id ${id}`)

  const updatedReport: IReport = await updateReportFields(
    id,
    req.body.reporterName,
    req.body.reporterAge,
    req.body.headline,
    req.file
  )

  res.status(200).json(updatedReport)
  return
}

export const downloadFile = async (req: Request, res: Response) => {
  res.status(404)
  return
}
