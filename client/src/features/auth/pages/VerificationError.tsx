import { Link } from 'react-router-dom'

export default function VerificationError() {
  return (
    <div className="min-h-dvh w-full flex flex-col justify-center items-center gap-5">
      <h2 className="text-xl">Verification Error</h2>
      <Link to="/" className="bg-black text-white p-1 rounded hover:opacity-50">
        Go back to HomePage
      </Link>
    </div>
  )
}
