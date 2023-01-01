const mongoose = require('mongoose');


const feedSchema = new mongoose.Schema({


    posts : [{
        type:mongoose.Schema.Types.ObjectId,
        
        ref:'Post'
    }],
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt: {
        type:Date,
        default: new Date()

    },
   

});

export default mongoose.model('Feed', feedSchema);
