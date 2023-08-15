import axios from 'axios';
import React, {useEffect} from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { toast  } from 'react-toastify';

function PrivateRoute() {
    const token=localStorage.getItem('token')
    const navigate=useNavigate()

    useEffect(()=>{
      (async()=>{
        try {
          const response=await axios.get('http://localhost:5000/loginUserData', {headers:{token:localStorage.getItem('token')}})
          localStorage.setItem('userData', JSON.stringify(response.data.user))
          console.log (response)
        } catch (error) {
         toast.error('Please Login')    
         localStorage.removeItem('token')
         localStorage.removeItem('userData')
         navigate('/login')
        }
      })()
    },[])

  return  token ? <Outlet/> : <Navigate to={'/login'} />
}

export default PrivateRoute