import React from 'react'
import { cat_img_1, cat_img_2, cat_img_3, cat_img_4, cat_img_5, cat_img_6, loading_img_1, loading_img_2, loading_img_3, loading_img_4, loading_img_5 } from '../assets/Doc/init'

const Loading = ({isLoading, text}) => {
  const loadingImgs = [loading_img_1, loading_img_2, loading_img_3, loading_img_4, loading_img_5];
  const catImgs = [cat_img_1, cat_img_2, cat_img_3, cat_img_4, cat_img_5, cat_img_6];
  const size = (isLoading) ? loadingImgs.length : catImgs.length;
  const ind = Math.floor(Math.random() * size + 1);
  const displayImage = (isLoading) ? loadingImgs[ind] : catImgs[ind];
  const description = text || ((isLoading) ? 'Loading...' : "Something Went Wrong" );
  return (
    <div className='w-[80%] max-w-[700px] flex flex-col justify-center items-center bg-white/50 rounded-2xl mx-auto mt-6 p-3'>
        <img 
            src={displayImage}
            className='w-[60%]'
            alt=''
        />
        <h2 className='text-bg_grey font-bold text-2xl'>{description}</h2>
    </div>
  )
}

export default Loading
