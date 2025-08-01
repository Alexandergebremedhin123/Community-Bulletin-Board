import React,{useState} from 'react'
import { Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import './Navbar.css'
import SearchPopup from './SearchPopup';

export default function Navbar() {

  const {auth, logout}=useAuth();
  const [showPopup,setShowPopup]=useState(false);
 const togglePopup=()=>{
   setShowPopup(!showPopup);
 }
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Community Bulletin Board</Link>
        <svg 
        onClick={togglePopup}
        xmlns='http://www.w3.org/2000/svg' fill="none" viewBox='0 0 24 24' strokeWidth={1.5} stroke="currentColor" className='size-6'>
          <path strokeLinecap='round' strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.6072"/>

        </svg>
        {showPopup&& <SearchPopup onClose={togglePopup}/>}

      </div>
      <div className="navbar-right">
        {
          auth.user?
          (
            <button className="logout-btn" onClick={logout}>Logout</button>
          )
          :
          (
            <p></p>
          )
        }
      </div>
    </nav>
    )
}
