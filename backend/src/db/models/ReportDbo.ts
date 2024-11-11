import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId
  reporterName: string
  reporterAge: number
  headline: string
  files: string[]
  lastUpdate: Date
}

const reportSchema = new Schema<IReport>({
  reporterName: { type: String, required: true },
  reporterAge: { type: Number, required: true },
  headline: { type: String, required: true },
  files: { type: [String], required: false },
  lastUpdate: { type: Date, default: Date.now }
})

export const ReportModel: Model<IReport> = mongoose.model(
  'report',
  reportSchema
)
