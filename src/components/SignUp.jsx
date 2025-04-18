import React from 'react'
import { useContext } from 'react'
import UserContext from '../context/userContext.js';

const Signup = () => {
  const {setUser, setLoggedIn} = useContext(UserContext);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleSubmitBtn = (e) => {
    e.preventDefault();
    setUser((prev) => ({...prev, username: username, password: password}));
    setLoggedIn(true);
  }
  return (
    <div className='flex flex-col items-center h-screen relative'>
      <h1 className='text-2xl font-semibold my-10'>Sign Up</h1>
      <input type='text' placeholder='UserName' value={username} 
      onChange={(e)=> setUsername(e.target.value)}/>
      <input type='password' placeholder='Password' value={password}
      onChange={(e)=> setPassword(e.target.value)} />
      <button className='bg-blue-500 text-white px-4 py-2 rounded'
      onClick={handleSubmitBtn}
      >
        Sign Up</button>
    </div>
  )
}

export default Signup
