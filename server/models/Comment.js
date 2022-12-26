import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type:String,
        required:true,
        
    },
    createdAt: {
        type:Date,
        default: new Date()
        
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    post: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    replies: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reply'
    }],
    replyCount: {
        type:Number,
        default:0
    },
    likesCount: {
        type:Number,
        default:0
    },



});



export default mongoose.model('Comment', commentSchema);