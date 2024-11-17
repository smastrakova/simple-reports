export interface CreateReportResponse {
  _id: string
  headline: string
  reporterName: string
  reporterAge: number
  files: []
}

export interface ReportSummaryResponse {
  _id: string
  reporterName: string
  headline: string
  lastUpdate: Date
}

export interface ReportsResponse {
  page: number
  pageSize: number
  total: number
  totalPages: number
  reports: ReportSummaryResponse[]
}

export interface ReportDetailResponse {
  reporterName: string
  reporterAge: number
  headline: string
  lastUpdate: Date
  files: FileDetailResponse[]
}

export interface FileDetailResponse {
  _id: string
  name: string
  size: number
}
