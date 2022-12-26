const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default: new Date()

    },
   isLiked: {
        type:Boolean,
        default:false
        
    },
    
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],

    comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    image: {
        type:String,
        default:''
    },
    views: {
        type:Number,
        default:0
    },
    tags: {
        type:Array,
        default:[],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true

    }

})


module.exports = mongoose.model('Post', postSchema)
