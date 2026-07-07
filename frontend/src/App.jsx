import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Home from './pages/Home'
import getCurrentUser from './features/getCurrentUser'
import { setUserData } from './redux/user.slice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      const response = await getCurrentUser()
      if (response && response.data) {
        dispatch(setUserData(response.data))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <>
      <Home />
    </>
  )
}

export default App