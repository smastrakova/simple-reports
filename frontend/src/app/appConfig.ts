import dotenv from 'dotenv'

dotenv.config()

export const REPORTS_API: string =
  process.env.REPORTS_API || 'http://localhost:5000'
