import {
  CreateReportResponse,
  ReportDetailResponse
} from '@/api/IReportResponse'
import ReportsApi from '@/api/reportsApi'
import logger from '@/util/logger'
import { FieldValues } from 'react-hook-form'

const reportApi = new ReportsApi()

export async function createNewReport(
  data: FieldValues
): Promise<CreateReportResponse | null> {
  try {
    const formData: FormData = new FormData()

    if (data.document && data.document.length != 0) {
      logger.debug('Will create report along with file')
      formData.append('file', data.document)
    }

    formData.append('headline', data.headline)
    formData.append('reporterName', data.reporterName)
    formData.append('reporterAge', data.reporterAge)

    logger.debug(`About to send this on BE ${formData}`)

    const response: CreateReportResponse =
      await reportApi.postFormData(formData)

    logger.debug(
      `Got report create response from BE: ${JSON.stringify(response)}`
    )
    return response
  } catch (error) {
    logger.error('Error creating report:', error)
    return null
  }
}

export async function updateExistingReport(
  data: FieldValues,
  reportId: string
): Promise<ReportDetailResponse | null> {
  try {
    const formData: FormData = new FormData()

    if (data.document && data.document.length != 0) {
      logger.debug('Will create report along with file')
      formData.append('file', data.document)
    } else {
      const emptyFile = new Blob([])
      formData.append('file', emptyFile, 'empty-file.txt')
    }

    formData.append('headline', data.headline)
    formData.append('reporterName', data.reporterName)
    formData.append('reporterAge', data.reporterAge)

    logger.debug(`About to send this on BE ${formData}`)

    const response: ReportDetailResponse = await reportApi.updateFormData(
      reportId,
      formData
    )

    logger.debug(
      `Got report update response from BE: ${JSON.stringify(response)}`
    )
    return response
  } catch (error) {
    logger.error('Error updating report:', error)
    return null
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  try {
    await reportApi.deleteReport(reportId)
    logger.debug(`Successfully deleted report`)
  } catch (error) {
    logger.error('Error deleting report:', error)
  }
}
