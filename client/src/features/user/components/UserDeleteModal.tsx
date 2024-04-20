import { useRef } from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../stores/authStore'

type UserDeleteModalProps = {
  closeModal: () => void
}

export default function UserDeleteModal({ closeModal }: UserDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const refresh = useAuthStore((state) => state.refresh)

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      closeModal()
    }
  }

  const deleteUser = () => {
    axios
      .delete('http://localhost:4000/user/delete', { withCredentials: true })
      .then(() => {
        refresh()
        navigate('/')
      })
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0  backdrop-blur-sm flex flex-col justify-center items-center"
      onClick={handleClose}
    >
      <div className="flex flex-col">
        <FontAwesomeIcon
          className="text-red-500 place-self-end"
          icon={faXmark}
          onClick={closeModal}
        />
        <div
          className="border-2 border-black px-10 py-3 flex flex-col items-center"
          onClick={handleClose}
        >
          <h3 className="text-lg mb-2">Delete User?</h3>
          <div className="flex gap-2">
            <button
              className="text-xs bg-blue-500 rounded-md text-white p-1"
              onClick={deleteUser}
            >
              Confirm
            </button>
            <button
              className="text-xs bg-red-500 rounded-md  text-white p-1"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
