import { Router } from 'express'
import {
  createReport,
  deleteReport,
  downloadFile,
  getReports,
  getReportSummary,
  getSingleReport,
  updateReport
} from '../controllers/reportRouteController.js'

const router: Router = Router()

router
  .get('/', async (req, res, next) => {
    try {
      await getReports(req, res)
    } catch (error) {
      next(error)
    }
  })
  .get('/summary', async (req, res, next) => {
    try {
      await getReportSummary(req, res)
    } catch (error) {
      next(error)
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      await getSingleReport(req, res)
    } catch (error) {
      next(error)
    }
  })
  .get('/:id/files/:fileId', async (req, res, next) => {
    try {
      await downloadFile(req, res)
    } catch (error) {
      next(error)
    }
  })
  .post('/', async (req, res, next) => {
    try {
      await createReport(req, res)
    } catch (error) {
      next(error)
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      await deleteReport(req, res)
    } catch (error) {
      next(error)
    }
  })
  .patch('/:id', async (req, res, next) => {
    try {
      await updateReport(req, res)
    } catch (error) {
      next(error)
    }
  })

export default router
