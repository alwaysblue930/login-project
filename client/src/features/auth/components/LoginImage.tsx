import loginImg from '../../../assets/login.jpg'

export default function LoginPicture() {
  return (
    <div className="hidden w-full md:block">
      <img className="w-full h-auto" src={loginImg}></img>
    </div>
  )
}
