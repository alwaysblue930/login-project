import axios from 'axios'
import useAuthStore from '../../../stores/authStore'
import { useRef, useState } from 'react'
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserDeleteModal from './UserDeleteModal'

export default function UserInfoDetails() {
  const user = useAuthStore((state) => state.user)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showModal, setShowModal] = useState(false)
  const sendVerificationEmail = async () => {
    if (buttonRef.current) {
      buttonRef.current.innerText = 'Sending...'
      buttonRef.current.disabled = true
    }

    await axios
      .get('http://localhost:4000/auth/email/new', { withCredentials: true })
      .then(() => {
        if (buttonRef.current) {
          buttonRef.current.innerText = 'Check Inbox'
          buttonRef.current.disabled = true
        }
      })
      .catch(() => {
        if (buttonRef.current) {
          buttonRef.current.innerText = 'Network Issue'
        }
      })
  }

  return (
    <>
      <div className="flex flex-col">
        <label className="text-xs">Id</label>
        <p className="text-sm mb-2">{user?.id}</p>
        <label className="text-xs">Email</label>
        <p className="text-sm mb-2">{user?.email}</p>
        <label className="text-xs">Email Verification</label>
        <div className="text-sm mb-3 flex gap-2 items-center">
          {user?.isVerified ? (
            <p className="text-xs">
              Verified
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="ml-1 text-green-500"
              />
            </p>
          ) : (
            <p className="text-xs">
              Not Verified
              <FontAwesomeIcon icon={faXmark} className="ml-1 text-red-500" />
            </p>
          )}
          <button
            className="text-xs bg-black text-white px-1 py-0.5 rounded-md 
          hover:bg-gray-700 cursor:pointer"
            ref={buttonRef}
            onClick={sendVerificationEmail}
            hidden={user?.isVerified}
            disabled={user?.isVerified}
          >
            {!user?.isVerified && 'Send Email'}
          </button>
        </div>
        <button
          className="text-sm rounded-md bg-red-500 text-white py-1 px-2"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </button>
      </div>
      {showModal && <UserDeleteModal closeModal={() => setShowModal(false)} />}
    </>
  )
}
