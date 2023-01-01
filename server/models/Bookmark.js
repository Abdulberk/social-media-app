const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User'
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        
        
        ref: 'Post'
    }
],
    createdAt: {
        type: Date,
        default: new Date()

    },
    

});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
