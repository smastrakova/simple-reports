import { Joi, Segments } from 'celebrate'

export const createReportValidation = {
  [Segments.BODY]: Joi.object({
    reporterName: Joi.string().required().messages({
      'any.required': 'reporterName is required.',
      'string.base': 'reporterName must be a string.',
      'string.empty': 'reporterName cannot be empty.'
    }),
    reporterAge: Joi.number().integer().required().messages({
      'any.required': 'reporterAge is required.',
      'number.base': 'reporterAge must be a number.',
      'number.integer': 'reporterAge must be an integer.',
      'number.min': 'reporterAge must be at least 1.',
      'number.max': 'reporterAge must be at least 150.'
    }),
    headline: Joi.string().required().messages({
      'any.required': 'headline is required.',
      'string.base': 'headline must be a string.',
      'string.empty': 'headline cannot be empty.'
    })
  })
}

export const idValidation = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'any.required': 'The ID parameter is required.',
      'string.hex': 'The ID parameter must be a valid ObjectID.',
      'string.length': 'The ID parameter must be 24 characters long.'
    })
  })
}

export const paginationValidation = {
  [Segments.PARAMS]: Joi.object({
    page: Joi.number().integer().min(1).optional().messages({
      'number.base': 'page must be a number.',
      'number.integer': 'page must be an integer.',
      'number.min': 'page must be at least 1.'
    }),
    limit: Joi.number().integer().min(1).optional().messages({
      'number.base': 'limit must be a number.',
      'number.integer': 'limit must be an integer.',
      'number.min': 'limit must be at least 1.'
    })
  })
}
