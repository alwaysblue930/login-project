import { ChangeEvent, useState } from 'react'
import useAuthStore from '../../../stores/authStore'
import axios from 'axios'

export default function UserInfoImage() {
  const user = useAuthStore((state) => state.user)
  const refresh = useAuthStore((state) => state.refresh)
  const [preview, setPreview] = useState<string | null>(user?.picture ?? null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgFile = e.target.files[0]

      const formData = new FormData()
      formData.append('picture', imgFile)

      axios
        .patch('http://localhost:4000/user/picture/update', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => refresh())

      const imgUrl = URL.createObjectURL(imgFile)
      setPreview(imgUrl)
    }
  }

  return (
    <div className="text-center">
      {preview && (
        <div className="w-32 h-auto rounded-full mb-1">
          <img src={preview} className="w-full h-auto" />
        </div>
      )}
      <label htmlFor="file" className="text-sm hover:cursor-pointer mr-2">
        Update Picture
      </label>
      <input
        id="file"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        hidden={true}
      />
    </div>
  )
}
