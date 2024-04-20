import { Link } from 'react-router-dom'
import useAuthStore from '../../../stores/authStore'

export default function VerificationSuccess() {
  useAuthStore((state) => state.refresh)()

  return (
    <div className="min-h-dvh w-full flex flex-col justify-center items-center gap-5">
      <h2 className="text-xl">Verification Success</h2>
      <Link to="/" className="bg-black text-white p-1 rounded hover:opacity-50">
        Go back to HomePage
      </Link>
    </div>
  )
}
