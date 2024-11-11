import { Request, Response } from 'express'
import { IReport } from '../db/models/ReportDbo.js'
import {
  createNewReport,
  removeReport,
  updateReportFields
} from '../handlers/reportHandler.js'
import logger from '../utils/logger.js'

export const getReports = async (req: Request, res: Response) => {
  res.status(404)
  return
}

export const getReportSummary = async (req: Request, res: Response) => {
  res.status(404)
  return
}

export const getSingleReport = async (req: Request, res: Response) => {
  res.status(404)
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
