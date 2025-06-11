import React , {useState} from 'react'
import background from '../assets/background_header.jpg'
import heroImage from '../assets/header_img.png'
import TypeEffect from './TypeEffect';
import { FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Card from './headerCard';
const Home = () => {
  const navigate = useNavigate();
  const fullDesc = `Manage and share prescriptions securely with our innovative medical app. Effortlessly store
  and access prescriptions through a user-friendly interface and robust security features. 
  Enhance communication and streamline workflows for healthcare providers and patients 
  alike, ensuring accuracy and compliance every step of the way.`

  const [descText, setDescText] = useState(fullDesc.slice(0, 100))
  const [isReadMore, setIsReadMore] = useState(false)
  function handleReadMore(){
    if (isReadMore){
      setDescText(fullDesc.slice(0, 100))
      setIsReadMore(false)
    }
    else{
      setDescText(fullDesc)
      setIsReadMore(true)
    }
  }
  return (
    <div className=''>
      {/* Hero */}
      <div className='relative'>
          <img src={background}
          className='w-full h-full object-cover mt-0'
          alt='background'
          />

          <div className='absolute rounded-2xl top-[10%] left-[15%] w-[70%] bg-black/20
          flex flex-row justify-between items-center py-4 px-8'>
            <div className='flex flex-col justify-center items-start w-[50%] h-full'>
              <h1 className='text-3xl text-white font-bold'>Welcome to HealthCare</h1>
              <p className='text-white text-opacity-80 mt-4 text-lg '>Your health is our <TypeEffect/></p>
              <p className='text-white text-opacity-80 mt-4 text-sm '>
                {descText}
                <span className='text-gray-700 cursor-pointer' onClick={handleReadMore}>
                  {isReadMore ? ' Read less' : ' Read more'}
                </span>
              </p>
              <button
              onClick={() => navigate('/allDoctors')}
              type='button'
              className='px-4 py-2 mt-8 flex items-center gap-2 text-white bg-gray-600 duration-200 rounded-2xl text-md transition-opacity hover:bg-gray-800'
              >
              <span>Explore Now</span> <span className=''><FaAngleDoubleRight /></span>
            </button>
            </div>
            <div >
              <img src={heroImage}
              className='w-full h-full object-cover'
              alt='hero'
              />
            </div>

          </div>
      </div>

      {/* Header Cards */}
      <div className='flex flex-col justify-center items-center py-8 w-full'>
        <Card/>
      </div>

    </div>

  )
}

export default Home
