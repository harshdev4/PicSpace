const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://upsign443:harshDev4@cluster0.7hwx8rs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/instagram");

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