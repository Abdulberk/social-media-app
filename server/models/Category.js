const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxlength:32,
        minlength:3,
        uppercase:true


    },
    createdAt: {
        type:Date,
        default: new Date()

    },

    posts: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

});


module.exports = mongoose.model('Category', categorySchema);


