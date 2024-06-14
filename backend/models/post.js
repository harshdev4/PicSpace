const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/picSpace");

const postSchema = new mongoose.Schema({
    username:{
        type: String,
        default: null
    },
    image:{ 
        type: String,
        required: true
    },
    caption:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
