import { Schema, model } from 'mongoose'
import { TUser } from './userZod.js'
import bcrypt from 'bcrypt'

const userMongoSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github', 'naver'],
      default: 'local',
    },
    picture: {
      type: String,
      default: process.env.FB_DEFAULT_PROFILE,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, id: true }
)

userMongoSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const UserModel = model<TUser>('User', userMongoSchema)

export default UserModel
