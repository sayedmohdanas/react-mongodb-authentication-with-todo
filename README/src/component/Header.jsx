import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { serverImageUrl } from '../utilis/config'
function Header() {
  const navigate=useNavigate()
  const logOut=()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    navigate('/login')
  }
  
  const userData=localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')):{}
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      {localStorage.getItem('token')&&(
  <div className="container-fluid">
     <li className="nav-item ">
     <img width={50} height={50} style={{borderRadius:'50%', objectFit:"cover"}} src={userData.profilePic ? serverImageUrl + userData.profilePic:"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1689894011~exp=1689894611~hmac=f1ffe460055e2c4b58fec33b8920dc168f24b05f150ce51762269db9d8b6781a"} />
        <button style={{marginLeft:"20px", marginRight:"20px,", borderRadius:"50px", marginTop:"4px"}}  className="btn  btn btn-outline-dark" >Welcome {userData.username}</button>
        </li>
    <Link to={"/"} className="navbar-brand" href="#" style={{marginLeft:"20px"}}>User</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav d-flex pr-3">
        <li className="nav-item">
        <button  className="btn btn-info btn-lg btn-block" onClick={logOut}>Logout</button>
        </li> 
      </ul>
    </div>
  </div>
  )}
</nav>
  )
}

export default Header