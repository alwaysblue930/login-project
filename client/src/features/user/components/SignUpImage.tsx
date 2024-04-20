import signupImg from '../../../assets/signup.jpg'

export default function SignUpImage() {
  return (
    <div className="hidden w-full md:block">
      <img className="w-full h-auto" src={signupImg}></img>
    </div>
  )
}
