import React,{ useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'

import {useAuth} from '../context/AuthContext'
import './Signup.css'
import {toast} from 'react-toastify'
export default function Signup() {

  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('');
  const [loading,setLoading]=useState(false);
  const {login}=useAuth();
  const navigate=useNavigate();
  const handleSubmit=async(e)=>{
    e.preventDefault();
 if(!name||!email||!password||!role){  
      toast.error('All fields are required');
      
      return;
    }
    try {
      setLoading(true);
      const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`,{
        
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({name,email,password,role}),
        credentials:'include',
      });

     
      const data=await response.json();
   
      if(response.ok){
        toast.success('Registration successful')
            
        login({email,role});
        navigate('/');
      }else{
        toast.error(data.message||'Registration failed');
      }
    } catch (error) {
      toast.error('Error during registration');
    }finally{
      setLoading(false);
    }
  }
 

  return (
    <div className='signup-page'>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
          <input
             type="text"
             placeholder="Name"
             value={name}
             onChange={(e)=>setName(e.target.value)}
             required
          />
          <div className='email-otp-container'>
          <input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             required
          />
          
          </div>
           <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           required
          />
          <select value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="" disabled hidden>Select your role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>    
          </select>
          <button type='submit'>Signup</button>
          <div className='login-link'>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
      </form>
    </div>
  )
}
