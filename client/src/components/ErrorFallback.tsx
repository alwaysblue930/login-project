import { Link } from 'react-router-dom'

export default function ErrorFallback() {
  return (
    <div className="min-h-dvh flex flex-col items-center gap-5">
      <h2 className="text-xl">404 | There was an Error</h2>
      <Link to="/">Go back to HomePage</Link>
    </div>
  )
}
