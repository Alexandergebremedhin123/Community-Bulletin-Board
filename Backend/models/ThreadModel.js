const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ThreadSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    forumboardId:{
        type:Schema.Types.ObjectId,
        ref:'Forumboard',
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});

const Thread=mongoose.model('Thread',ThreadSchema);
module.exports=Thread;