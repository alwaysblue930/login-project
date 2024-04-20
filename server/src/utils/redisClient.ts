import { createClient } from 'redis'
import logger from './logger.js'

const client = createClient()

client.on('error', (err) => logger.info('Redis Client Error', err))
client.on('connect', () => logger.info('Redis connected'))

await client.connect()

export default client
