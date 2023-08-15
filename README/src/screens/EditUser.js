import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';

function EditUser() {
  const [selectImage, setSelectImage]=useState(null)
    const navigate=useNavigate()
    const location = useLocation();
  const { id } = location.state;

    console.log({id})

    const [formData, setFormData] = useState({ username:"", age:"",email:""});
    const [loading, setLoading]=useState(false)
    const [apiError, setApiError]=useState('')
    const [errors, setErrors]=useState({username:"",age:"", email:""})


    useEffect(()=>{
        (async()=>{
            if(!id){
                return;
            }

            try {
                const userDataResponse= await axios.get('http://localhost:5000/getUserData/'+id, {headers:{token:localStorage.getItem('token')}})        
                const user=userDataResponse.data.user;
                setFormData({username:user.username, email:user.email, age:user.age})
            } catch (error) {
                if(error.response && axios.isAxiosError(error)){
                    alert(error.response.data.msg)
                }
               navigate('/') 
            }
        })();
    },[id, navigate]);
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleImageChange=(e)=>{
      setSelectImage(e.target.files[0])
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
      setLoading(true)
      if(!verifySubmit()){
        setTimeout(()=>{
            setLoading(false)
        },3000)
        return;
      }

      const form=new FormData()
      form.append('username', formData.username)
      form.append('age', formData.age)
      form.append('email', formData.email)
      form.append('_id', id)
      form.append('profile-file',selectImage)

      try{
        await axios.patch('http://localhost:5000/updateUser',
       form,
        {headers:{token:localStorage.getItem('token'), 'Content-type':'multipart/form-data'}})
        navigate('/')
      }catch(error){
        if(error.response&&axios.isAxiosError(error)){
            setApiError(error.response.data.msg)
        }
      }finally{
        setLoading(false)
      }
     
    };
  
  return (
    <>
  <section className="" style={{backgroundColor:"#000000"}}>
  <div className="container py-5 ">
    <div className="row d-flex justify-content-center align-items-center ">
      <div className="col col-xl-10">
        <div className="card" style={{borderRadius:"1rem", }}>
          <div className="row g-0">
            <div className=" d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">

                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center justify-content-center mb-3 pb-1">
                    <i className="fas fa-cubes fa-2x me-3" style={{color:" #ff6219"}}></i>
                    <span className="h1 fw-bold mb-0 text-center">Update Form</span>
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
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Upload File</label>
      <input
        type="file"
        accept='image/*'
        name='profilePic'
        value={formData.profilePic}
        onChange={handleImageChange}
      />
            {errors.profilePic&&<p className='text-danger'>{errors.profilePic}</p>}

    </div>
    {apiError&&<p className='text-danger'>{apiError}</p>}
    <button type="submit" className="btn btn-dark btn-lg btn-block">{loading ?<div className="spinner-border text-info" role="status">
    </div>:'Update'}</button>
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

export default EditUser