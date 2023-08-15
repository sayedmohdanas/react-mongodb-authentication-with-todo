import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const navigate=useNavigate()

    const [userData, setUserData]=useState({username:"", password:""})
    const [errors, setErrors]=useState({username:"", password:"",})
    const [apiError, setApiError]=useState('')

    

    const handleChange=(e)=>{
        setUserData({
            ...userData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit  =async (e) => {
        e.preventDefault();

        try {
           const response=await axios.post('http://localhost:5000/login', userData) 
           localStorage.setItem('token',response.data.token)
           console.log(response)

           navigate('/')

        } catch (error) {
          setApiError(error?.response?.data.msg)  
        }

        let errObj={ username:"", password:'',}
        let isValid=true
        if(userData.username===""){
            errObj.username='Username is required'
            isValid=false
        }
        if(userData.password===""){
            errObj.password='password is required'
            isValid=false
        }else if(userData.password.length<6){
            errObj.password='password length should be greater than 6'
            isValid=false  
        }

        setErrors(errObj)
        return isValid
    }


  return (
    <div>
<section className="vh-100" style={{backgroundColor:"#9A616D"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className="card" style={{borderRadius:"1rem"}}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
                alt="login form" className="img-fluid" style={{borderRadius:"1rem 0 0 1rem", height:"610px"}} />
            </div>
            <div className="col-md-6 col-lg-7 d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">

                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <i className="fas fa-cubes fa-2x me-3" style={{color:" #ff6219"}}></i>
                    <span className="h1 fw-bold mb-0">Sign into your account</span>
                  </div>
                  <div className="form-outline mb-4">
                  <label className="form-label" for="form2Example17">User Name</label>
                    <input type="text"
                    id="username"
                    name='username'
                    className="form-control form-control-lg"
                    value={userData.username}
                    onChange={handleChange}/> 
                    {errors.username&&<p className='text-danger'>{errors.username}</p>}
                  </div>

                  <div className="form-outline mb-4">
                  <label className="form-label" for="form2Example27">Password</label>
                    <input type="password"
                     className="form-control form-control-lg"
                    name='password'
                    value={userData.password}
                    onChange={handleChange}
                    />  
                      {errors.password&&<p className='text-danger'>{errors.password}</p>}
                  </div>
                  {apiError&&<p className='text-danger'>{apiError}</p>}

                  <div className="pt-1 mb-4 g-5 d-flex justify-content-between align-items-center">
                    <button  className="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                    <a className="small text-muted" href="#!">Forgot password?</a>
                  </div> 
                  <p className="mb-5 pb-lg-2" style={{color:"#393f81"}}>Don't have an account?<Link to={'/register'} style={{color:"#393f81"}}>Register here</Link></p>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Login