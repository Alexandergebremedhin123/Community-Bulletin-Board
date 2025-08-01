import React,{useEffect,useState} from 'react'
import {BrowserRouter as Router,Route,Routes,Navigate, useNavigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider,useAuth } from './context/AuthContext';
import './App.css'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './pages/ProfilePage';
import ForumboardDetails from './pages/ForumboardDetails'
const ProtectedRoute=({children})=>{
  const {auth,login}=useAuth();
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();

  useEffect(()=>{
    const checkLoginStatus=async()=>{
      try {
        const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`,{
          method:'GET',
          credentials:'include',
        });
        const data=await response.json();
        if(response.ok && data.ok){
          login({userId:data.userId});
          setLoading(false);
        }else{
          toast.error(data.message||'Session expired. Please log in again.');
          navigate('/login');
        }
       
      } catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      }finally{
        setLoading(false);
      }
    }
    checkLoginStatus();
  },[navigate])
    if(loading){
      return <div>Loading...</div>;
    }
  return auth.user? children : <Navigate to='/login'/>;
}


export default function App() {
  return (
   <AuthProvider>
     <Router>
       <Navbar/>
       <Routes>
         <Route path="/login" element= {<Login/>}/>
         <Route path="/signup" element={<Signup/>}/>
        <Route 
         path="/"
         element={
           <ProtectedRoute>
             <ProfilePage/>
           </ProtectedRoute>
         }
         />
          <Route 
         path="/forumboard/:forumboardid"
         element={
           <ProtectedRoute>
             <ForumboardDetails/>
           </ProtectedRoute>
         }
         />
       </Routes>
       <ToastContainer/>
     </Router>
  </AuthProvider>
  )
}
