import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import {
  FileSummaryResponse,
  ReportSummaryResponse
} from '../../src/controllers/IReportResponse.js'
import {
  getReports,
  getReportSummary,
  getSingleReport
} from '../../src/controllers/reportRouteController.js'
import { fetchFileSummary } from '../../src/handlers/fileHandler.js'
import {
  countReports,
  findAllReports,
  findOneReport
} from '../../src/repositories/reportRepository.js'

interface MockRequest extends Partial<Request> {
  query?: { [key: string]: string }
  body?: { [key: string]: any }
  params?: { [key: string]: string }
  headers?: { [key: string]: string }
}

interface MockResponse extends Partial<Response> {
  status?: jest.Mock
  json?: jest.Mock
  send?: jest.Mock
  setHeader?: jest.Mock
}

const mockRequest = (overrides: MockRequest = {}): Request => {
  const req: MockRequest = {
    query: {},
    body: {},
    params: {},
    headers: {},
    ...overrides
  }

  return req as Request
}

export const mockResponse = (overrides: MockResponse = {}): Response => {
  const res: MockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    ...overrides
  }

  return res as Response
}

jest.mock('../../src/handlers/reportHandler')
jest.mock('../../src/handlers/fileHandler')
jest.mock('../../src/repositories/reportRepository')
jest.mock('../../src/repositories/fileRepository')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Reports routes', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    res = mockResponse()
  })

  it('should return a list of reports', async () => {
    const expectedTotal = 5
    const expectedReports = [
      {
        _id: new ObjectId('67309b257253cdff522e2660'),
        reporterName: 'Fake Reporter',
        reporterAge: 3,
        headline: 'Bad behavior',
        files: [],
        lastUpdate: new Date('2024-11-10T11:19:05.606Z')
      }
    ]

    const expectedResponse = {
      total: expectedTotal,
      page: 1,
      pageSize: 5,
      totalPages: Math.ceil(expectedTotal / 5),
      reports: expectedReports
    }

    ;(findAllReports as jest.Mock).mockImplementation(
      (pageNumber: number, limitNumber: number) => {
        return expectedReports
      }
    )
    ;(countReports as jest.Mock).mockImplementation(() => {
      return Promise.resolve(expectedTotal)
    })

    req = mockRequest({
      query: { page: '1', limit: '5' }
    })

    await getReports(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    )
  })

  it('should return a reports summary', async () => {
    const expectedTotal = 5
    const expectedReports: ReportSummaryResponse[] = [
      {
        _id: '67309b257253cdff522e2660',
        headline: 'Bad behavior',
        lastUpdate: new Date('2024-11-10T11:19:05.606Z'),
        reporterName: 'Fake Reporter'
      }
    ]

    const expectedResponse = {
      total: expectedTotal,
      page: 1,
      pageSize: 5,
      totalPages: Math.ceil(expectedTotal / 5),
      reports: expectedReports
    }

    ;(findAllReports as jest.Mock).mockImplementation(
      (pageNumber: number, limitNumber: number) => {
        return expectedReports
      }
    )
    ;(countReports as jest.Mock).mockImplementation(() => {
      return Promise.resolve(expectedTotal)
    })

    req = mockRequest({
      query: { page: '1', limit: '5' }
    })

    await getReportSummary(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    )
  })

  it('should return report detail', async () => {
    const expectedFileSummary: FileSummaryResponse = {
      _id: '67311595da3fdcb354677315',
      name: 'screenshot.png',
      size: 2608150
    }

    const expectedResponse = {
      reporterName: 'Fake Reporter',
      reporterAge: 3,
      headline: 'Bad behavior',
      lastUpdate: new Date('2024-11-10T11:19:05.606Z'),
      files: [expectedFileSummary]
    }

    ;(findOneReport as jest.Mock).mockImplementation(
      (pageNumber: number, limitNumber: number) => {
        return expectedResponse
      }
    )
    ;(fetchFileSummary as jest.Mock).mockImplementation(() => {
      return expectedFileSummary
    })

    req = mockRequest({
      params: { id: '67309b257253cdff522e2660' }
    })

    await getSingleReport(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    )
  })
})
