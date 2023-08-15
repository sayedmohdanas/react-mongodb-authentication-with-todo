/* eslint-disable jsx-a11y/alt-text */
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { serverImageUrl } from '../utilis/config';
import {toast} from 'react-toastify'

function GetUserDetails() {
    const navigate=useNavigate()
    
    const [users, setUser]=useState([])

    useEffect (()=>{
        (async()=>{
          try {
            const response=await axios.get('http://localhost:5000/getUsers/', {headers:{token:localStorage.getItem('token')}})
            setUser(response.data.users) 
            console.log(response.data.users)
          } catch (error) {
            toast.error(error?.response?.data?.msg||'Please Login')    
            localStorage.removeItem('token')
            localStorage.removeItem('userData')
            navigate('/login')
          }
            
        })();
    },[]);

    const deleteUser=async(id)=>{
        try {
            await axios.delete('http://localhost:5000/deleteUser/'+id, {headers:{token:localStorage.getItem('token')}})
            setUser(users.filter(el=>el._id !==id))
        } catch (error) {
            
        }
    }

    console.log(users)
  return (
    <div style={{backgroundColor:"#116D6E", height:"100vh", display:"flex",}}>
    <div className='container '>
        <table className=" table-bordered table-card">
    <thead>
      <tr>
        <th>Profile</th>
        <th>Username</th>
        <th>Email</th>
        <th>Age</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.username}>
          <td><img width={50} height={50} style={{borderRadius:'50%', objectFit:"cover"}} src={user.profilePic ? serverImageUrl + user.profilePic:"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1689894011~exp=1689894611~hmac=f1ffe460055e2c4b58fec33b8920dc168f24b05f150ce51762269db9d8b6781a"} /></td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.age}</td>
          <td>
          <button
                  className='btn btn-primary'
                  onClick={() => navigate('/editUser', { state: { id: user._id } })}
                >
                  Edit
                </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => deleteUser(user._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
  )
}

export default GetUserDetails