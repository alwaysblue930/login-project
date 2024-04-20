import landingImg from '../../../assets/landing.jpg'

export default function Landing() {
  return (
    <div className="grid md:grid-cols-2 place-items-center">
      <div>
        <div className="font-bold text-3xl">
          <p>Hi,</p>
          <p>I am TaeHyun,</p>
          <p>Web Developer,</p>
        </div>
        <p className="my-2">Full Stack Developer</p>
        <div className="flex gap-5 items-center">
          <button
            className="px-2 border-2 border-black
          hover:bg-black hover:text-white transition duration-300 ease-in-out text-sm md:text-base md:px-5 md:py-2 "
          >
            Contact Me
          </button>
          <button
            className="px-2 border-2 border-black
          hover:bg-black hover:text-white transition duration-300 ease-in-out text-sm md:text-base md:px-5 md:py-2"
          >
            View Projects
          </button>
        </div>
      </div>
      <div className="hidden w-3/4 md:block">
        <img src={landingImg} className="w-full h-auto" />
      </div>
    </div>
  )
}
