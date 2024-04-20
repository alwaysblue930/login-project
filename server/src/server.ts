import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectMongo } from './utils/connectMongo.js'
import logger from './utils/logger.js'
import errorHandler from './middlewares/errorHandler.js'
import userRouter from './features/user/userRouter.js'
import authRouter from './features/auth/authRouter.js'
import oauthRouter from './features/oauth/oauthRouter.js'
const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/oauth', oauthRouter)
app.use('/user', userRouter)
app.use(errorHandler)

app.get('/', (_req: Request, res: Response) => {
  res.send('Home page')
})

app.listen(process.env.PORT, async () => {
  try {
    await connectMongo()
    console.log(`Server running on port ${process.env.PORT}`)
  } catch {
    logger.error('Error while starting the server')
  }
})
