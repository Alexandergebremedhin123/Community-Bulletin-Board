const mongoose=require('mongoose');
const ForumboardSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    description:{
        type: String,
        trim: true,
    },
    users:[String],
    threads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread',
    }]
},{timestamps: true});


const Forumboard= mongoose.model('Forumboard',ForumboardSchema);

module.exports=Forumboard;