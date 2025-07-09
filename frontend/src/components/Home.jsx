import React , {useEffect, useState} from 'react'
import background from '../assets/background_header.jpg'
import heroImage from '../assets/hero_section_2.png'
import TypeEffect from './TypeEffect';
import {colorfulDoctorCategories, fullDesc} from '../constants.js'
import { FaSearch, FaCalendarCheck, FaAngleDoubleRight, FaUserMd, FaLock } from "react-icons/fa";
import {MdHealthAndSafety} from "react-icons/md";
// import { FaUserMd } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from './headerCard.jsx';
import CircularCard from './CircularCard.jsx';
import SearchBar from './SearchBar.jsx';
import Loading from './Loading.jsx';

  const features = [
    { icon: <FaLock />, title: 'Secure & Private', desc: 'Your medical data is safe and encrypted.' },
    { icon: <FaUserMd />, title: 'Verified Doctors', desc: 'Consult certified professionals across specialties.' },
    { icon: <FaCalendarCheck />, title: 'Easy Booking', desc: 'Book appointments in seconds.' },
  ];

  const steps = [
    { icon: <FaSearch />, label: 'Search a Doctor' },
    { icon: <FaCalendarCheck />, label: 'Book an Appointment' },
    { icon: <MdHealthAndSafety />, label: 'Get Treatment' },
  ];


const Home = () => {
  const navigate = useNavigate();
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
  const { userInfo } = useSelector((state) => state.user);
  return (
    (!userInfo || userInfo.role === 'user') ? 
    (<div className='w-[80%] max-w-[1200px] mb-20 mx-auto relative flex flex-col justify-center items-center'>
      {/* Hero */}
      <div className='mx-auto flex flex-row justify-center items-center relative'>
        <div className='flex flex-col justify-center items-start w-[50%] h-full'>
          <h1 className='text-3xl font-bold'>Welcome to HealthCare</h1>
          <p className='text-opacity-80 mt-4 text-lg '>Your health is our <TypeEffect/></p>
          <p className='text-opacity-80 mt-4 text-sm '>
            {descText}
            <span className='text-gray-700 cursor-pointer' onClick={handleReadMore}>
              {isReadMore ? ' Read less' : ' Read more'}
            </span>
          </p>
          <button
            onClick={() => navigate('/allDoctors')}
            className="inline-flex items-center mt-4 gap-2 bg-bg_grey hover:opacity-80 text-white font-medium px-6 py-2 rounded-full transition-opacity"
          >
            Explore Now <FaAngleDoubleRight />
          </button>

        </div>
        <div >
          <img src={heroImage}
          className='w-full h-full object-cover'
          alt='hero'
          />
        </div>
      </div>

      {/* Why choose section */}
      <div className='w-[85%] mt-4'>
        <Card title={"Why Choose Medify?"} data={features}/>
      </div>
      {/* <DoctorGroups/> */}
      <div className='w-[85%] mt-4'>
        <CircularCard title={'Find Doctors By Category'} data={colorfulDoctorCategories}/>
      </div>

    </div>) : (<Loading isLoading={0} text="Unauthorised Access To Page"/>)
  )
}

export default Home