import { z } from 'zod'

export const userZodSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .email()
    .refine((email) => email.toLowerCase() === email, {
      message: 'Email must be lowercase',
    }),
  password: z.string().min(8),
  provider: z.enum(['local', 'google', 'github', 'naver']),
  picture: z.string(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userSignUpSchema = z
  .object({
    email: z
      .string()
      .email()
      .refine((email) => email.toLowerCase() === email, {
        message: 'Email must be lowercase',
      }),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const userLoginSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.toLowerCase() === email, {
      message: 'Email must be lowercase',
    }),
  password: z.string().min(8),
})

export type TUser = z.infer<typeof userZodSchema>
export type TUserSignUp = z.infer<typeof userSignUpSchema>
export type TUserLogin = z.infer<typeof userLoginSchema>
