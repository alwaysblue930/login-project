import { Navigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { PropsWithChildren } from 'react'

export default function VerifyUserId({ children }: PropsWithChildren) {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)

  console.log('test')

  if (!user || user.id !== id) {
    return <Navigate to="/auth/login" />
  }

  return children
}
