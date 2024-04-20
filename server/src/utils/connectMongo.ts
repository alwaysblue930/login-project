import mongoose from 'mongoose'
import logger from './logger.js'

mongoose.connection.on('connected', () => logger.info('Mongodb connected'))
mongoose.connection.on('open', () => logger.info('Mongodb open'))
mongoose.connection.on('disconnected', () =>
  logger.info('Mongodb disconnected')
)
mongoose.connection.on('reconnected', () => logger.info('Mongodb reconnected'))
mongoose.connection.on('disconnecting', () => logger.info('Mongodb connecting'))
mongoose.connection.on('close', () => logger.info('Mongodb close'))

export const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI as string)
}
