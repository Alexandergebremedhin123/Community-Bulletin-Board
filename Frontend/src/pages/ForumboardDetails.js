import React,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import './ForumboardDetails.css'

export default function ForumboardDetails(){
    const {forumboardid}=useParams();
    const[forumboard,setForumboard]=useState(null);
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);
    const [showPopup,setShowPopup]=useState(false);
    const [threadTitle,setThreadTitle]=useState('');
    const [threadDescription,setThreadDescription]=useState('');
    const [showJoinPopup,setShowJoinPopup]=useState(false);
    const [otp,setOtp]=useState('');
    const [showOtpPopup,setShowOtpPopup]=useState(false);
    const [otpError,setOtpError]=useState('');
   
    
  const fetchForumboardDetails=async()=>{

    try {
        setLoading(true);
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/getforumboardbyid/${forumboardid}`,{
            method:'GET',
            credentials:'include',
        }) 
        const data=await response.json();
        if(response.ok){
            setForumboard(data.data);
        }else{
            toast.error(data.message||'Failed to fetch forum board details');
        }
     } catch (error) {
         toast.error('An error occuring while fetching forum board details');
     }finally{
         setLoading(false)
     }
 }
  
    useEffect(()=>{
        fetchForumboardDetails();
    },[forumboardid]);
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
            } catch(error) {
                toast.error('An error occuring while fetching user data');
            }finally{
                setLoading(false)
            }
        }
        fetchUser();
    },[])

const handleAddThread=()=>{
    setShowPopup(true);
}
const handleSubmitThread=async()=>{
    try {
       const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/addthread`,{
           method:'POST',
           headers:{
               'Content-Type':'application/json',
           },
           body:JSON.stringify({
               title:threadTitle,
               description:threadDescription,
               forumboardId:forumboardid
           }),
           credentials:'include',
       }) 
       const data=await response.json();
       if(response.ok){
           toast.success('Thread created successfully');
           setThreadTitle('');
           setThreadDescription('')
           setShowPopup(false)
           fetchForumboardDetails()
       }else{
           toast.error(data.message||'Failed to create a Thread')
       }
    } catch (error) {
        toast.error('An error occured while creating a Thread');
    }
}
const handleClosePopup=()=>{
    setShowPopup(false);
}
const handleJoinRequest=async()=>{
    try {
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/request-to-join`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
             forumboardId:forumboardid,
             UserEmail:user?.email,
            }),
            credentials:'include',
        }) 
        const data=await response.json();
      
        if(response.ok){
            setShowJoinPopup(false);
            fetchForumboardDetails();
            setShowOtpPopup(true);
            toast.success('OTP sent to the Admin'); 
        }else{
            toast.error(data.message||'Failed to send join request')
        }
     } catch (error) {
         toast.error('An error occured while sending join request');
     }
}
const handleSubmitOtp=async()=>{
    try {
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/forumboard/verify-otp`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
             forumboardId:forumboardid,
             UserEmail:user?.email,
             
            }),
            credentials:'include',
        }) 
        const data=await response.json();
        if(response.ok){
            setOtp('');
            setShowOtpPopup(false);
            toast.success('Successfully joined the forumboard'); 
            fetchForumboardDetails();
           
        }else{
            toast.error(data.message||'Failed to verify otp')
        }
     } catch (error) {
         toast.error('An error occured while verifying otp');
     }
}
const handleCloseOtpPopup=()=>{
    setShowOtpPopup(false);
    setOtpError('')
}


if(loading){
    return <div className='loading'>Loading...</div>
}

 const isUser=forumboard?.users.includes(user?.email);
const isAdmin=forumboard?.admin===user?._id;

    return(
        <div className='forumboard-details'>
            <div className="section1">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Forumboard"
                    className='forumboard-image'
                />
                <h1 className='forumboard-name'>{forumboard?.name}</h1>
                <p className='forumboard-description'>{forumboard?.description}</p>
            {isAdmin&&(
                <button className='add-thread-btn' onClick={handleAddThread}>
                    Add Thread
                </button>
            )}
   
       { !isUser&& !isAdmin&&(  //isOwner&&  isStudent 
                <button className='add-thread-btn' onClick={()=>setShowJoinPopup(true)}>
                   Join Forum Board
                </button>
            )}
          
            </div> 
            <div className='thread-grid'>
            {
                (isUser||isAdmin)&& forumboard?.threads?.length>0?(
                    forumboard.threads.map((thread,index)=>(
                        <div key={index} className="thread-card">
                            <h3>{thread.title}</h3>
                            <p>{thread.description}</p>
                            <small>{new Date(thread.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))
                ):(
                    <p>No threads available</p>
                )
            }
            </div>
        {showPopup&&(
        <div className='popup-overlay'>
            <div className='popup-content'>
                <h3>Add Thread</h3>
                <input
                type="text"
                placeholder='Title'
                value={threadTitle}
                onChange={(e)=>setThreadTitle(e.target.value)}
                />
                <textarea
                placeholder='Description'
                value={threadDescription}
                onChange={(e)=>setThreadDescription(e.target.value)}
                />
                <div className='popup-buttons'>
                    <button onClick={handleSubmitThread}>Submit</button>
                    <button onClick={handleClosePopup}>Close</button>
                </div>
            </div>
        </div>


        )}
             {showJoinPopup&&(
            <div className='popup-overlay'>
                <div className='popup-content'>
                    <h3>Join Request</h3>
                    <p>Do you want to join this forum board? An OTP will be sent to the class owner for approval.</p>
                    <div className='popup-buttons'>
                        <button onClick={handleJoinRequest}>Send Join Request</button>
                        <button onClick={()=>setShowJoinPopup(false)}>Close</button>
                    </div>
                </div>
            </div>

            
        )}
        {showOtpPopup&&(
            <div className='popup-overlay'>
                <div className='popup-content'>
                    <h3>Enter OTP</h3>
                    <input
                    type="text"
                    placeholder="Enter OTP"
                    // value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                    />
                    {/* {otpError && <p className='otp-error'>{otpError}</p>} */}
                </div>
                <div className='popup-buttons'>
                     <button onClick={handleSubmitOtp}>Submit</button>
                     <button onClick={handleCloseOtpPopup}>Close</button>
                </div>
            </div>
        )}

        </div>
    )
}