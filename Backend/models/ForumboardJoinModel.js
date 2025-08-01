const mongoose=require('mongoose');

const ForumboardJoinSchema=new mongoose.Schema({
    forumboardId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Forumboard',
        required:true,
    },
    UserEmail:{
        type:String,
        required:true,
    },
    AdminEmail:{
        type:String,
        required:true,
    }
},{timestamps:true});

const ForumboardJoin =mongoose.model('ForumboardJoin',ForumboardJoinSchema);

module.exports=ForumboardJoin;