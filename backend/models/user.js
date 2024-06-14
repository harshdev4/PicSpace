const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://upsign443:harshDev4@cluster0.7hwx8rs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/instagram");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    fullname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
    },
    profileBio:{
        type:String,
    },
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likedPost:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }    
});

module.exports = mongoose.model('User', userSchema);