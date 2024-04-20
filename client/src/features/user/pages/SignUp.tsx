import SignUpForm from '../components/SignUpForm'
import SignUpImage from '../components/SignUpImage'

export default function SignUp() {
  return (
    <div className="grid w-full md:grid-cols-2 place-items-center">
      <SignUpForm />
      <SignUpImage />
    </div>
  )
}
