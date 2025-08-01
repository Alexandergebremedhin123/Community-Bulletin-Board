const express=require('express');
const Forumboard=require('../models/ForumboardModel');
const User=require('../models/UsersModel')
const Thread=require('../models/ThreadModel')
const ForumboardJoin=require('../models/ForumboardJoinModel')
const responseFunction=require('../utils/responseFunction');
const authTokenHandler=require('../middlewares/checkAuthToken');
const router=express.Router();

router.post('/create',authTokenHandler, async(req,res)=>{
    const {name,description}=req.body;
    if(!name){
        return responseFunction(res,400,'Forumboard name is required',null,false);
    }
    try{
       const newForumboard=new Forumboard({
            name,
            description,
            admin:req.userId,
            users:req.userId
        });
        await newForumboard.save()
        return responseFunction(res,201,'Forumboard created successfully',newForumboard,true);
    }
    catch(err){
        return responseFunction(res,500,'Internal Server error',err,false);
    }
})

router.get('/createdforumboard',authTokenHandler,async(req,res)=>{
    try{
        
        const forumboards=await Forumboard.find({admin:req.userId});
        return responseFunction(res,200,'Forumboard fetched successfully',forumboards,true);
    }catch(err){
        return responseFunction(res,500,'Internal server error',err,false)
    }
})

router.get('/getforumboardbyid/:forumboardid',authTokenHandler,async(req,res)=>{
   const {forumboardid}=req.params;
    try{
        const forumboard=await Forumboard.findById(forumboardid).populate('threads');
       if(!forumboard){
        return responseFunction(res,404,'Forumboard not found',null,false);
       }
        return responseFunction(res,200,'Forumboard fetched successfully',forumboard,true)
    }
    catch(err){
        return responseFunction(res,500,'Internal Server Error',err,false)
    }
})

router.post('/addthread',authTokenHandler,async(req,res)=>{
    const {title,description,forumboardId}=req.body;
    try{
        const forumboard=await Forumboard.findById(forumboardId);
        if(!forumboard){
            return res.status(404).json({message:'Forumboard not found'});
        }
        console.log(req.userId)
        const newThread=new Thread({
            title,
            description,
            forumboardId,
            createdBy:req.userId,
        });
        await newThread.save();

        forumboard.threads.push(newThread._id);
        await forumboard.save();
        res.status(201).json({message:'Thread Created Succcessfully',thread:newThread});

    }
    catch(error){
        res.status(500).json({message:'Server error',error});
    }
})

router.get('/forumboards/search',async(req,res)=>{
    try{
        const term=req.query.term;
        if(!term){
          return responseFunction(res,400,'Search term is required',null,false);

        }
        const results=await Forumboard.find({
            name:{$regex: new RegExp(term,'i')}
        })

        if(results.length===0){
            return responseFunction(res,404,'Forumboard not Found',null,false);
       }
       responseFunction(res,200,'Search results',results,true);
    }
    catch(error){
        console.error(error);
        responseFunction(res,500,'Internal Server Error',error,false);
    }
})

router.post('/request-to-join',async(req,res)=>{
    const{forumboardId,UserEmail}=req.body;
    if(!forumboardId|| !UserEmail){
        return responseFunction(res,400,'Forumboard ID and user email are required',null,false);

    }
    
    try{
        const forumboard=await Forumboard.findById(forumboardId);
      if(!forumboard){
        return responseFunction(res,404,'Forumboard not found',null,false);
        
      }
      const adminId=forumboard.admin;
      const admin=await User.findById(adminId);
      if(!admin){
        return responseFunction(res,404,'Admin not found',null,false);

      }
    const AdminEmail=admin.email;
      const newForumboardJoin=new ForumboardJoin({
          forumboardId,
          UserEmail,
          AdminEmail
      })
    await newForumboardJoin.save();
    return responseFunction(res,200,'Successfully requested to join',null,true)
  

    }

    catch(error){
        console.error(error);
        responseFunction(res,500,'Internal Server Error',error,false);
    }

})

router.post('/verify-otp',authTokenHandler,async(req,res)=>{
    const {forumboardId,UserEmail}=req.body;
    if(!forumboardId||!UserEmail){
        return responseFunction(res,400,'Forumboard ID, User email are required',null,false);
        
    }
    try{
        const joinRequest=await ForumboardJoin.findOne({
            forumboardId,
            UserEmail,
          
        });
        if(!joinRequest){
            return responseFunction(res,400,'Invalid OTP or join request not found',null,false);

        }
        const forumboard =await Forumboard.findById(forumboardId);
        
        if(!forumboard){
            return responseFunction(res,404,'Forumboard not found',null,false);
            
        }
        if(!forumboard.users.includes(UserEmail)){
            forumboard.users.push(UserEmail);
            await forumboard.save();            
        }
        await ForumboardJoin.deleteOne({_id:joinRequest._id});
        return responseFunction(res,200,'Successfully Verified OTP',null,true);
        
    }
    catch(error){
        console.error(error);
        responseFunction(res,500,'Internal Server Error',error,false);
    }
})

router.get('/forumboard',authTokenHandler,async(req,res)=>{
    try{
        const user=await User.findById(req.userId);
        if(!user){
           return responseFunction(res,404,'User not found',null,false);
        }
        const UserEmail=user.email
    
        const forumboards=await Forumboard.find({users:UserEmail});
       
        if(forumboards.length===0){
            return responseFunction(res,404,'No Forumboards found for this user',null,false);
            
        }
        responseFunction(res,200,'forumboards are here',forumboards,true);

    }
    catch(error){
      
        console.error(error);
        responseFunction(res,500,'Internal Server Error',error,false);
    }
})
module.exports=router;