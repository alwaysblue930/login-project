import { useNavigate } from 'react-router-dom'
import SocialLogins from '../../auth/components/SocialLogins'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TUserSignUp, userSignUpSchema } from '../../../utils/userZod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import handleZodError from '../../../utils/handleZodError'

export default function SignUpForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TUserSignUp>({ resolver: zodResolver(userSignUpSchema) })

  const onSubmit: SubmitHandler<TUserSignUp> = async (data) => {
    await axios
      .post('http://localhost:4000/user/signup', data, {
        withCredentials: true,
      })
      .then(() => navigate('/auth/login'))
      .catch((e: Error | AxiosError) => {
        if (axios.isAxiosError(e)) {
          const zodIssues = e.response?.data?.zod
          if (zodIssues) {
            handleZodError(zodIssues, setError)
          } else {
            setError('root', {
              type: 'server',
              message: e.response?.data?.error,
            })
          }
        } else {
          setError('root', {
            type: 'server',
            message: 'Cannot connect with server',
          })
        }
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-2 border-black w-full flex flex-col px-5 md:w-3/4"
    >
      <h3 className="text-base my-2">Welcome!</h3>
      <h1 className="text-lg font-semibold mb-1">Sign up to</h1>
      <h5 className="text-xs mb-3">TaeHyun's website</h5>
      <label htmlFor="email" className="text-xs mb-2">
        Email
      </label>
      <input
        {...register('email')}
        defaultValue=""
        id="email"
        className="border-2 border-black p-1 mb-2"
        placeholder="Enter your username"
      ></input>
      {errors.email && (
        <p className="text-xs text-red-500 mb-2">{errors.email.message}</p>
      )}
      <label htmlFor="password" className="text-xs mb-2">
        Password
      </label>
      <input
        {...register('password')}
        id="password"
        type="password"
        className="border-2 border-black p-1 mb-2"
        placeholder="Enter your password"
      ></input>
      {errors.password && (
        <p className="text-xs text-red-500 mb-2">{errors.password.message}</p>
      )}
      <label htmlFor="confirmPassword" className="text-xs mb-2">
        Confirm Password
      </label>
      <input
        {...register('confirmPassword')}
        id="confirmPassword"
        type="password"
        className="border-2 border-black p-1 mb-2"
        placeholder="Confirm your password"
      ></input>
      {errors.confirmPassword && (
        <p className="text-xs text-red-500 mb-2">
          {errors.confirmPassword.message}
        </p>
      )}
      <p className="text-sm text-right mb-3">Forgot Password?</p>
      {
        <button
          className={`bg-black text-white p-1 rounded-lg mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading' : 'Sign Up'}
        </button>
      }
      {errors.root && (
        <p className="text-xs text-center text-red-500 mb-2">
          {errors.root.message}
        </p>
      )}
      <p className="text-center mb-2">
        Already have an account? <strong>Login</strong>
      </p>
      <SocialLogins />
    </form>
  )
}
