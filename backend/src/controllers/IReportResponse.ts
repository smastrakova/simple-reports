import { IReport } from '../db/models/ReportDbo.js'

export interface ReportSummaryResponse {
  _id: string
  reporterName: string
  headline: string
  lastUpdate: Date
}

export interface FileSummaryResponse {
  _id: string
  name: string
  size: number
}

export interface ReportDetailResponse {
  reporterName: string
  reporterAge: number
  headline: string
  lastUpdate: Date
  files: FileSummaryResponse[]
}

export function convertToSummary(report: IReport): ReportSummaryResponse {
  return {
    _id: report._id.toString(),
    reporterName: report.reporterName,
    headline: report.headline,
    lastUpdate: report.lastUpdate
  }
}

export function convertToDetail(
  report: IReport,
  storedFiles: FileSummaryResponse[]
): ReportDetailResponse {
  return {
    reporterName: report.reporterName,
    reporterAge: report.reporterAge,
    headline: report.headline,
    lastUpdate: report.lastUpdate,
    files: storedFiles
  }
}
