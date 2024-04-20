import { zodResolver } from '@hookform/resolvers/zod'
import { TUserLogin, userLoginSchema } from '../../../utils/userZod'
import SocialLogins from './SocialLogins'
import { useForm, SubmitHandler } from 'react-hook-form'
import { parseAndDecode } from '../../../utils/parseJwt'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import handleZodError from '../../../utils/handleZodError'
import useAuthStore from '../../../stores/authStore'

export default function LoginForm() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TUserLogin>({ resolver: zodResolver(userLoginSchema) })

  const onSubmit: SubmitHandler<TUserLogin> = (data) => {
    axios
      .post('http://localhost:4000/auth/login', data, {
        withCredentials: true,
      })
      .then(() => {
        const decoded = parseAndDecode()
        login(decoded)
        navigate('/')
      })
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
            message: 'Cannot connect to server',
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
      <h1 className="text-lg font-semibold mb-1">Sign in to</h1>
      <h5 className="text-xs mb-3">TaeHyun's website</h5>
      <label htmlFor="email" className="text-xs mb-2">
        Email
      </label>
      <input
        {...register('email')}
        defaultValue=""
        id="email"
        className="border-2 border-black p-1 mb-2"
        placeholder="Enter your Email"
      ></input>
      {errors.email && (
        <p className="text-xs text-red-500 mb-2">{errors.email.message}</p>
      )}
      <label htmlFor="password" className="text-xs mb-2">
        Password
      </label>
      <input
        {...register('password')}
        defaultValue=""
        id="password"
        type="password"
        className="border-2 border-black p-1 mb-2"
        placeholder="Enter your password"
      ></input>
      {errors.password && (
        <p className="text-xs text-red-500 mb-2">{errors.password.message}</p>
      )}
      <p className="text-sm text-right mb-3">Forgot Password?</p>
      <button className="bg-black text-white p-1 rounded-lg mb-3" type="submit">
        Login
      </button>
      {errors.root && (
        <p className="text-xs text-center text-red-500 mb-2">
          {errors.root.message}
        </p>
      )}
      <p className="text-center mb-2">
        Don't have an account? <strong>Register</strong>
      </p>
      <SocialLogins />
    </form>
  )
}
