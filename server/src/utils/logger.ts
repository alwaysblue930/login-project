import winston, { format } from 'winston'
const { combine, colorize, simple } = format

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), simple()),
  transports: [new winston.transports.Console()],
})

export default logger
