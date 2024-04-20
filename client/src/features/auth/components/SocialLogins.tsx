import google from '../../../assets/google.png'
import github from '../../../assets/github.png'
import naver from '../../../assets/naver.png'
import axios from 'axios'

export default function SocialLogins() {
  const oauthInitiate = (e: React.MouseEvent<HTMLButtonElement>) => {
    axios
      .get(`http://localhost:4000/oauth/${e.currentTarget.name}`, {
        withCredentials: true,
      })
      .then((res) => {
        window.location.href = res.data
      })
  }

  return (
    <>
      <p className="text-xs text-gray text-center mb-2">or continue with</p>
      <div className="flex justify-center gap-x-3 mb-3">
        <button name="google" onClick={oauthInitiate} className="w-8 h-8">
          <img
            className="w-full h-auto"
            src={google}
            alt="Sign in with Google"
          />
        </button>
        <button
          name="github"
          onClick={oauthInitiate}
          className="w-8 h-8"
          type="button"
        >
          <img
            className="w-full h-auto"
            src={github}
            alt="Sign in with Github"
          />
        </button>
        <button
          name="naver"
          onClick={oauthInitiate}
          className="w-8 h-8"
          type="button"
        >
          <img className="w-full h-auto" src={naver} alt="Sign in with Naver" />
        </button>
      </div>
    </>
  )
}
