import React from 'react'
import { nature4, christmasDecor4 } from '../assets/Doc/init'

const CircularCard = ({title, data}) => {
  return (
    <div className='relative z-10 mx-auto bg-bg_white rounded-2xl shadow-md p-6 flex flex-col items-center w-full max-w-7xl'>
      <h3 className="font-bold text-xl">{title}</h3>
      <img src={christmasDecor4} alt="" className='absolute top-0 left-0 w-54 h-54 opacity-20 -z-10' />
      <img src={nature4} alt='' className='absolute -rotate-90 bottom-0 right-0 w-54 h-54 opacity-20 -z-10' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 z-10 opacity-80'>
        {data.map((item, index) => (
          <div key={index} className='relative flex flex-col items-center justify-center bg-white shadow-lg w-55 h-55 rounded-full p-6 hover:shadow-xl duration-300
          cursor-pointer hover:opacity-80 overflow-hidden transition-all group'>
            <div className='absolute z-15 mx-auto rounded-full w-full h-full top-0 left-0 opacity-30
             bg-gradient-to-t from-bg_grey to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out
            '></div>
            <div className='text-4xl mb-4'>
              <img src={item.icon}
              className='w-25 h-25 object-cover group-hover:translate-y-[40%] transition-transform duration-500 ease-in-out'
              alt='hero'/>
            </div>
            <h3 className='text-lg text-center font-semibold mb-2 group-hover:translate-y-[40%] group-hover:opacity-0 transition-all duration-500 ease-in-out'>{item.title}</h3>
            <p className='text-center max-w-25 text-gray-600 group-hover:translate-y-[40%] group-hover:opacity-0 transition-all duration-500 ease-in-out'>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CircularCard
