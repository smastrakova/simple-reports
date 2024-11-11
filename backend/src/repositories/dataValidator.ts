import mongoose from 'mongoose'

export function validateId(id: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format: \'${id}\'`)
  }
}
