import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IFile extends Document {
  _id: mongoose.Types.ObjectId
  data: Buffer
  name: string
  lastUpdate: Date
  sizeInBytes: number
  mimeType: string
}

const reportFileSchema = new Schema<IFile>({
  data: { type: Buffer, required: true },
  name: { type: String, required: true },
  lastUpdate: { type: Date, default: Date.now },
  sizeInBytes: { type: Number, required: true },
  mimeType: { type: String, required: true }
})

export const FileModel: Model<IFile> = mongoose.model(
  'report_file',
  reportFileSchema
)
