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
