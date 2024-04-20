import nodemailer from 'nodemailer'
import logger from './logger.js'
import jwt from 'jsonwebtoken'

export const sendEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: '5m',
    })

    const info = await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Verify Email',
      html: `<p>Click below link to verify Email.</p>
      <a href='http://localhost:4000/auth/email/verify/${token}'>Verify</a>`,
    })
    logger.info(`message sent: ${info.messageId}`)
  } catch (e) {
    logger.error(e)
  }
}
