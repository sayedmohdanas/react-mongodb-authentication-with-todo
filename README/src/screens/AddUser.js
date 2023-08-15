import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';

function AddUser() {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        username:"",
        password:"",
        age:"",
        email:""
    });
    const [apiError, setApiError]=useState('')

    const [errors, setErrors]=useState({
        username:"",
        password:"",
        age:"",
        email:""
    })

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const verifySubmit=()=>{
        let errObj={ username:"",
        password:'',
        age:'',
        email:''}
        let isValid=true
        if(formData.username===""){
            errObj.username='Username is required'
            isValid=false
        }
        if(formData.password===""){
            errObj.password='password is required'
            isValid=false
        }else if(formData.password.length<6){
            errObj.password='password length should be greater than 6'
            isValid=false  
        }

        const age=parseInt(formData.age)
        if(!age){
            errObj.age='Age is required'
            isValid=false
        }else if(age<18 || age>40){
            isValid=false
            errObj.age='Age should be between 18 to 40'
        }

        if(formData.email===''){
            isValid=false
            errObj.email='Email is required'
        }
        setErrors(errObj)
        return isValid
    }
 
  
    const handleSubmit  =async (e) => {
      e.preventDefault();
      if(!verifySubmit()){
        return;
      }
      try{
    await axios.post('http://localhost:5000/register', {name:formData.username, password:formData.password, age:formData.age, email:formData.email})
        navigate('/login')
        console.log(formData)
      }catch(error){
        if(error.response&&axios.isAxiosError(error)){
            setApiError(error.response.data.msg)
        }
      }
     
    };
  
  return (
    <>
<section className="" style={{backgroundColor:"#000000"}}>
  <div className="container py-5 ">
    <div className="row d-flex justify-content-center align-items-center ">
      <div className="col col-xl-10">
        <div className="card" style={{borderRadius:"1rem", height:"700px"}}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                alt="login form" className="img-fluid" style={{borderRadius:"1rem ",height:"680px" }} />
            </div>
            <div className="col-md-6 col-lg-7 d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">

                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <i className="fas fa-cubes fa-2x me-3" style={{color:" #ff6219"}}></i>
                    <span className="h1 fw-bold mb-0">Sign into Register account</span>
                  </div>
                  <div className="form-outline mb-4">
                  <label className="form-label" for="form2Example17">User Name</label>
                    <input type="text"
                    id="username"
                    name='username'
                    className="form-control form-control-lg"
                    value={formData.username}
                    onChange={handleChange}/> 
                    {errors.username&&<p className='text-danger'>{errors.username}</p>}
                  </div>

                  <div className="form-outline mb-4">
                  <label className="form-label" for="form2Example27">Password</label>
                    <input type="password"
                     className="form-control form-control-lg"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    />  
                      {errors.password&&<p className='text-danger'>{errors.password}</p>}
                  </div>
                  <div className="mb-3">
      <label htmlFor="age" className="form-label">Age</label>
      <input
        type="number"
        className="form-control"
        id="age"
        name='age'
        value={formData.age}
        onChange={handleChange}
      />
            {errors.age&&<p className='text-danger'>{errors.age}</p>}
            </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input
        type="email"
        className="form-control"
        id="email"
        name='email'
        value={formData.email}
        onChange={handleChange}
      />
            {errors.email&&<p className='text-danger'>{errors.email}</p>}

    </div>
    {apiError&&<p className='text-danger'>{apiError}</p>}
    <div className='d-flex justify-content-between align-items-center'>
    <button type="submit" className="btn btn-dark btn-lg btn-block items-center">Submit</button>
    <p className="" style={{color:"#393f81"}}>Already user account?<Link to={'/login'} style={{color:"#393f81"}}>Login</Link></p>
    </div>
    </form>
    </div>
    </div>
   </div>
  </div>
  </div>
</div>
</div>
</section>
  </>

  )
}

export default AddUser