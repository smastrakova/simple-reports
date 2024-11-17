import { REPORTS_API } from '@/app/appConfig'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  CreateReportResponse,
  ReportDetailResponse,
  ReportsResponse
} from './IReportResponse'

export default class ReportsApi {
  private readonly api: AxiosInstance = axios.create({
    baseURL: REPORTS_API
  })

  async getReports(page: number, limit: number): Promise<ReportsResponse> {
    const response: AxiosResponse = await this.api.get<ReportsResponse>(
      '/reports/summary',
      {
        params: {
          page,
          limit
        }
      }
    )

    return response.data
  }

  async getReportDetail(id: string): Promise<ReportDetailResponse> {
    const response: AxiosResponse = await this.api.get<ReportDetailResponse>(
      `/reports/${id}`
    )
    return response.data
  }

  async postFormData(formData: FormData): Promise<CreateReportResponse> {
    const response: AxiosResponse = await this.api.post<CreateReportResponse>(
      '/reports',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  }

  async deleteReport(id: string): Promise<ReportsResponse> {
    const response: AxiosResponse = await this.api.delete<ReportsResponse>(
      `/reports/${id}`
    )

    return response.data
  }

  async updateFormData(
    id: string,
    formData: FormData
  ): Promise<ReportDetailResponse> {
    const response: AxiosResponse = await this.api.patch<ReportDetailResponse>(
      `/reports/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  }

  getDownloadUrl = (reportId: string, fileId: string) => {
    return `${this.api.getUri()}/reports/${reportId}/files/${fileId}`
  }
}
