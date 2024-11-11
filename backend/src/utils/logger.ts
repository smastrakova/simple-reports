import winston, { Logger } from 'winston'

const logger: Logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

export default logger
