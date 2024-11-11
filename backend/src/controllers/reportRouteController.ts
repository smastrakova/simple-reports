import { Request, Response } from 'express'
import { IReport } from '../db/models/ReportDbo.js'
import { createNewReport } from '../handlers/reportHandler.js'

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
  res.status(404)
  return
}

export const updateReport = async (req: Request, res: Response) => {
  res.status(404)
  return
}

export const downloadFile = async (req: Request, res: Response) => {
  res.status(404)
  return
}
