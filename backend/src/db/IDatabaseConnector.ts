export interface IDatabaseConnector {
  connectDB(): Promise<void>
  disconnectDB(): Promise<void>
}
