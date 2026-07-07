import React from 'react'
import { auth, googleProvider } from '../utils/firebase'
import { signInWithPopup } from 'firebase/auth'
import api from '../utils/axios'
import Home from './pages/Home'

const App = () => {
  return (
    <>
    <Home/>
    </>
  )
}

export default App