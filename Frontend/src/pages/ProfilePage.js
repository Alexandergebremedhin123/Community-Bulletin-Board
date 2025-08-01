import React,{useEffect,useState} from 'react'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import './ProfilePage.css'
import Profile from '../images/user.png'
export default function ProfilePage () {
     const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const [showPopup,setShowPopup]=useState(false);
    const [forumboardName,setForumboardName]=useState('');
    const [description,setDescription]=useState('');
    const [forumboardCreated,setForumboardCreated]=useState([]);
    const [forumboardJoined,setForumboardJoined]=useState([]);
    const navigate=useNavigate();
   
    useEffect(()=>{
        const fetchUser=async()=>{
            try {
               const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`,{
                   method:'GET',
                   credentials:'include',
               }) 
               const data=await response.json();
               
               if(response.ok){
                   setUser(data.data);
               }else{
                   toast.error(data.message||'Failed to fetch user data');
               }
            } catch (error) {
                toast.error('An error occuring while fetching user data');
            }finally{
                setLoading(false)
            }
        }
        fetchUser();
    },[])
   
const fetchForumboards=async()=>{
        try {
            const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/createdforumboard`,{
                method:'GET',
                credentials:'include',
            }) 
            const data=await response.json();
            if(response.ok){
                setForumboardCreated(data.data);
            }else{
                toast.error(data.message||'Failed to fetch forumboards');
            }
         } catch (error) {
             toast.error('An error occuring while fetching forumboards');
         }
}
const fetchForumboardsJoined=async()=>{
    try {
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/forumboard`,{
            method:'GET',
            credentials:'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add this line
              },
        }) 
       
        const data=await response.json();
    
        if(response.ok){
            setForumboardJoined(data.data);
        
        }
     } catch (error) {
         toast.error('An error occuring while fetching joined forumboards');
     }
}


   useEffect(()=>{
       if(user){
           fetchForumboardsJoined();
           fetchForumboards();
         
       }
   },[user]);
   
   const handleCreateForumboard=async()=>{
    try {
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/create`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                name:forumboardName,
                description,
            }),
            credentials:'include',
        }) 
        const data=await response.json();
        if(response.ok){
           toast.success('Forumboard created successfully');
           setForumboardName('')
           setDescription('')
           setShowPopup(false)
           fetchForumboards()
        }else{
            toast.error(data.message||'Failed to fetch forum boards');
        }
     }  catch (error) {
           toast.error('An error occured while creating a forum board')
       }
   }

const handleRowClick=(forumboardId)=>{
    navigate(`/forumboard/${forumboardId}`);
}

return (
    <div className='profile-page'>
        {loading?(
            <div className='loading'>Loading...</div>
        )
            :user?(
                <>
                <h1>Profile</h1>
                <div className='profile-info'>
                    <img
                    src={Profile}
                    alt="Profile"
                    className='profile-picture'
                    />
                    <div className='profile-details'>
                        <h2>{user.name}</h2>
                        <p>Email:{user.email}</p>
                        <p>Role:{user.role}</p>
                        {user.role==='Admin'&&(
                            <button className='create-forumboard-btn' onClick={()=> setShowPopup(true)}>
                                Create Forum Board
                            </button>
                        )

                        }
                    </div>
                </div>
                {showPopup&&(
                    <div className='popup-overlay'>
                        <div className='popup-content'>
                            <h3>Create Forum Board</h3>
                        <input
                         type="text"
                         placeholder="Forum Board Name"
                         value={forumboardName}
                         onChange={(e)=>setForumboardName(e.target.value)}
                        />
                        <textarea
                        placeholder='Description'
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
                        />
                        <div className='popup-buttons'>
                            <button onClick={handleCreateForumboard}>Submit</button>
                            <button onClick={()=>setShowPopup(false)}>Cancel</button>
                        </div>
                        </div>

                    </div>
                )}
                {
                    user.role==='Admin'?
                        <div className='forumboard-list'>
                            <h3>Forum Boards created</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forumboardCreated.map(forumboard=>(
                                        <tr key={forumboard._id} onClick={()=>handleRowClick(forumboard._id)}>
                                            <td>{forumboard.name}</td>
                                            <td>{forumboard.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className='forumboard-list'>
                              <h3>Forum Boards joined</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forumboardJoined.map(forumboard=>(
                                        <tr key={forumboard._id} onClick={()=>handleRowClick(forumboard._id)}>
                                            <td>{forumboard.name}</td>
                                            <td>{forumboard.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                }
                </>
            )
            :( 
                <p>No user data found</p>
            )
        }
    </div>
  )
}
