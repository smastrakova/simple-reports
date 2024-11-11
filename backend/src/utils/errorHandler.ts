import { isCelebrateError } from 'celebrate'
import { NextFunction, Request, Response } from 'express'
import { decode } from './errorMessageDecoder.js'
import logger from './logger.js'

export function logErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(decode(err))
  next(err)
}

export function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isCelebrateError(err)) {
    const validationError = err.details.get('body')
    const message = validationError
      ? validationError.message
      : 'Invalid data provided'
    res.status(400).json({
      message: 'Bad Request: ' + message
    })
  } else {
    handleCustomErrors(err, req, res, next)
  }
}

function handleCustomErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (err.name) {
    case 'ValidationError':
      res.status(400).json({
        message: 'Bad Request: Invalid data provided'
      })
      break
    case 'NotFoundError':
      res.status(404).json({
        message: 'Not Found: The requested resource could not be found'
      })
      break
    case 'MissingResultError':
      next(err)
      break
    default:
      next(err)
  }
}

export function errorHandler(err: Error, req: Request, res: Response) {
  res.status(500).json({
    message: 'Internal Server Error. Please try again later.'
  })
}
