
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({

    content: {
        type:String,
        required:true,
        maxlength:1000,
        minlength:1,

    },
    createdAt: {
        type:Date,
        default: new Date()

    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comment: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    likesCount: {
        type:Number,
        default:0
    },



})

module.exports = mongoose.model('Reply', replySchema);

