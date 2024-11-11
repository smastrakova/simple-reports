import dotenv from 'dotenv'

dotenv.config()

export const PORT: number = Number(process.env.PORT) || 5000
export const DATABASE_URL: string =
  process.env.MONGODB_URI || 'mongodb://localhost:27017'
