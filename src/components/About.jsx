import React from 'react'
import { useContext } from 'react'
import UserContext from '../context/userContext'

const About = () => {
  const {user, isLoggedIn, isAdmin, isLoading, error} = useContext(UserContext);
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isLoggedIn ? <h1 className='text-2xl font-semibold my-10'>Welcome {user.username}</h1> : <h1 className='text-2xl font-semibold my-10'>Please log in</h1>}
      {isAdmin && <p>You are an admin</p>}
    </div>
  )
}

export default About
