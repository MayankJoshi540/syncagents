import React from 'react'
import { auth, googleProvider } from '../utils/firebase'
import { signInWithPopup } from 'firebase/auth'
import api from '../utils/axios'

const App = () => {
  const googleLogin = async()=>{
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  }
  const handleLogin = async(token)=>{
    try{
      const {data} = await api.post("/auth/login",{token});
      console.log(data);
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div className='w-full h-screen bg-black flex justify-center items-center'>
      <button onClick={googleLogin} className='w-[250px] h-[45px] bg-white rounded-lg flex justify-center items-center cursor-pointer'>
        continue with google
      </button>
    </div>
  )
}

export default App