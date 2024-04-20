import UserInfoDetails from '../components/UserInfoDetails'
import UserInfoImage from '../components/UserInfoImage'

export default function UserInfo() {
  return (
    <div className="border-2 border-red-500 w-full flex flex-col items-center justify-center">
      <UserInfoImage />
      <UserInfoDetails />
    </div>
  )
}
