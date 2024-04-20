import LoginForm from '../components/LoginForm'
import LoginImage from '../components/LoginImage'

export default function Login() {
  return (
    <div className="grid w-full md:grid-cols-2 place-items-center ">
      <LoginForm />
      <LoginImage />
    </div>
  )
}
