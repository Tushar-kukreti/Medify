import React from 'react'
import Loading from './Loading'

const NotFound = () => {
  return (
    <div className='w-full'>
      <Loading isLoading={0} text={'404 Page Not Found'} />
    </div>
  )
}

export default NotFound
