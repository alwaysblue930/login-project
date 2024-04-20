import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const user = useAuthStore((state) => state.user)
  const logoutAsync = useAuthStore((state) => state.logoutAsync)
  console.log(user)
  console.log(isLoggedIn)

  const handleLogout = async () => {
    await logoutAsync()
  }
  return (
    <header>
      <nav className="flex justify-between py-2 items-center">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>
        <ul className="flex gap-5">
          {isLoggedIn ? (
            <>
              <Link to={`/user/${user?.id}`}>
                <div className="w-8 h-auto rounded-full">
                  <img src={user?.picture} className="w-full h-auto" />
                </div>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login">Login</Link>
              <Link to="/user/signup">SignUp</Link>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
