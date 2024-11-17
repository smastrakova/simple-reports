import { ReportSummaryResponse } from '@/api/IReportResponse'
import moment from 'moment'

export const formatTimestamp = (data: ReportSummaryResponse) => {
  return moment(data.lastUpdate).format('MM/DD/YYYY, h:mm A')
}

export const formatTimestampDate = (data: Date) => {
  return moment(data).format('MM/DD/YYYY, h:mm A')
}
