import { celebrate } from 'celebrate'
import { Router } from 'express'
import multer, { Multer, StorageEngine } from 'multer'
import {
  createReportValidation,
  idValidation
} from '../controllers/inputValidator.js'
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
const fileSizeLimitInBytes: number = 16 * 1024 * 1024

const storage: StorageEngine = multer.memoryStorage()
const upload: Multer = multer({
  storage,
  limits: {
    fileSize: fileSizeLimitInBytes
  }
})

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
  .post(
    '/',
    upload.single('file'),
    celebrate(createReportValidation),
    async (req, res, next) => {
      try {
        await createReport(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
  .delete('/:id', async (req, res, next) => {
    try {
      await deleteReport(req, res)
    } catch (error) {
      next(error)
    }
  })
  .patch(
    '/:id',
    upload.single('file'),
    celebrate(idValidation),
    async (req, res, next) => {
      try {
        await updateReport(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

export default router
