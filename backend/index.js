const express = require('express');  // for creating server
const rateLimit = require('express-rate-limit'); // for limiting the traffic for the route
const jwt = require('jsonwebtoken'); // for creating token
const userModel = require('./models/user'); // for managing the UserdataModel in mongodb
const postModel = require('./models/post'); // post model
const cookieParser = require('cookie-parser'); // for managing cookies
const bcrypt = require('bcrypt'); // for encrypting password
// const upload = require('./multer');  // for uploading images
const path = require('path');  // for joining directory path
const app = express();
const fs = require('fs');
const {upload, resizeImage} = require('./multer');
const limiter = rateLimit({
    windowMs: 60 * 1000, // for 1 minute
    max: 100 // limit each IP to 100 requests per windowMs
});

// to read the body data with the request i.e. req.body
app.use(express.json());
// cookieParser is used to read, write the cookies by giving methods like req.cookies/cookie 
app.use(cookieParser());

// secret key for making jwt token encrypted
const secretKey = '4*Y893Mnklrsgt*&%^&*&U4651adsgmk';

/* handling profile route */
app.get('/api/profile/:username', async function (req, res) {
    // check for token
    const username = req.params.username;
    try {
        const user = await userModel.findOne({ username });
        if (user) {
            user.password = '';
            res.status(201).send(user);
        }
        else {
            res.status(404).json({ error: "No user found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* handling search user noutes */

app.get('/api/getUser/:fullname', async function (req, res) {
    const fullname = req.params.fullname;
    try {
        const regex = new RegExp(fullname, 'i');
        const users = await userModel.find({ fullname: regex });
        users.forEach((user) => {
            user.password = ""
        });
        res.send(users);
    } catch (error) {
        res.status(400).send("Invalid characters found");
    }
});


/* when nothing is send from the search bar */

app.get('/api/getUser/', async function (req, res) {
    res.send([]);
})


/* handling logout route */

app.get('/api/logout', function (req, res) {
    // clearing the token from the cookie
    try {
        res.clearCookie('token');
        res.status(201).send('Logout SuccessFully');
    } catch (error) {
        res.status(500).json({ error: "Unable to logout, Try again after sometime" });
    }
});

/* handling the new account route */

app.post('/api/register', async function (req, res) {
    // destructing all the field data from the body
    const { email, username, fullname, password } = req.body;
    // finding whether the user already existed
    const user = await userModel.findOne({ $or: [{ username }, { email }] });

    // if user already existed, return
    if (user) {
        return res.status(409).json({ error: "User already exists" });
    }

    // make an encrypted password
    const encryptPassword = await bcrypt.hash(password, 12);

    // create a new document for the new user
    const newUser = await userModel.create({
        email, username, fullname, password: encryptPassword
    });

    // create a token using jwt and pass the payload containing every field except password
    const token = jwt.sign({
        userId: newUser._id,
        username,
        email,
        fullname
    }, secretKey, {
        expiresIn: 3 * 24 * 60 * 60,   // expires after days
    });

    // store the above create token in cookie
    res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false
    });

    res.status(201).json({ message: "User signed in successfully", token, success: true, user });
});


/* handling the login route */

app.post('/api/login', limiter, async function (req, res) {
    // destructing the username and password from the body
    const { username, password } = req.body;

    // find the user based on the username
    const user = await userModel.findOne({ username });

    // if the user existed
    if (user) {
        try {
            // compare the entered password with the encrypted password
            const match = await bcrypt.compare(password, user.password);

            // if password matches
            if (match) {
                // create a jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username,
                    email: user.email,
                    fullname: user.fullname
                }, secretKey, {
                    expiresIn: 3 * 24 * 60 * 60,
                });

                // store the above created jwt in cookie
                res.cookie("token", token, {
                    withCredentials: true,
                    httpOnly: false
                });
                res.status(201).json({ message: "User Logged in successfully", token, success: true, user });
            }

            // if password not matches
            else {
                res.status(400).json({ error: "Invalid username or password" })
            }
            //if any error occur during the comparation of password
        } catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }

    }
    // if user not exists
    else {
        res.status(400).json({ error: "Invalid username or password" })
    }
});


/* edit pic for profile route */

app.post('/api/profile/editPic', upload.single('profilePic'), resizeImage, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    try {
        const user = await userModel.findOne({ username: decoded.username });
        if (user.profilePic) {
            const imagePath = path.join(__dirname, 'public', 'images', 'uploads', user.profilePic);
            fs.unlinkSync(imagePath);
        }
        user.profilePic = req.file.filename;
        await user.save();
        user.password = "";
        res.status(201).json({ message: "Profile pic updated successfully", user });

    } catch (error) {
        res.status(500).json({ error, decoded });
    }
});

/* edit fullname and bio for profile route */

app.post('/api/profile/edit', async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    try {
        const user = await userModel.findOne({ username: decoded.username });
        user.fullname = req.body.fullname;
        user.profileBio = req.body.profileBio;
        await user.save();
        user.password = "";
        res.status(201).json({ message: "Profile update successfully", user });

    } catch (error) {
        res.status(500).json({ error, decoded });
    }
});


/* create a new post route */

app.post('/api/create-post', upload.single('postImage'), resizeImage, async function (req, res) {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    const postImage = req.file.filename;
    const postCaption = req.body.postCaption;
    const user = await userModel.findOne({ username: decoded.username });
    try {
        const post = await postModel.create({
            image: postImage,
            caption: postCaption,
            userId: user._id
        });
        console.log(post._id);
        user.post.push(post._id);
        await user.save();
        res.status(201).json({ message: "post created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server error, try again" });
    }
})


/* get the post for profile page */

app.get('/api/getPost/:username', async function (req, res) {
    const username = req.params.username;
    try {
        const user = await userModel.findOne({ username }).populate('post');
        const posts = user.post;
        res.status(201).send(posts.reverse());

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

/* get the liked post for profile page */

app.get('/api/getPost/:username/likedPost', async function (req, res) {
    const username = req.params.username;
    try {
        const user = await userModel.findOne({ username }).populate('likedPost');
        const posts = user.likedPost;
        res.status(201).send(posts.reverse());

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})


/* handling the image request from the frontend */

app.get('/api/getImages/:filename', function (req, res) {
    const imagePath = path.join(__dirname, 'public', 'images', 'uploads', req.params.filename);
    res.sendFile(imagePath);
})


/* view full post route */

app.get('/api/viewPost/:postId', async function (req, res) {
    const postId = req.params.postId;
    try {
        const post = await postModel.findOne({ _id: postId }).populate("userId");
        res.status(201).send(post);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})


/* handling likes for post route */

app.get('/api/like/:postId', async function (req, res) {
    const postId = req.params.postId;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    const username = decoded.username;
    try {
        let user = await userModel.findOne({ username });
        let post = await postModel.findOne({ _id: postId });
        if (user.likedPost.includes(postId)) {
            user.likedPost = user.likedPost.filter((id) => id.toString() !== postId.toString());
            post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
            await user.save();
            await post.save();
            res.status(201).json({ message: "Like removed successfully", likeCount: post.likes.length });
        } else {
            user.likedPost.push(postId);
            post.likes.push(user._id);
            await user.save();
            await post.save();
            res.status(201).json({ message: "Like added successfully", likeCount: post.likes.length });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/api/post/:postId/edit', async function (req, res) {
    const postId = req.params.postId;
    const editedCaption = req.body.editedCaption;
    try {
        const post = await postModel.findById(postId);
        post.caption = editedCaption;
        await post.save();
        res.status(201).json({ message: "Caption edited successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/post/delete/:postId', async function (req, res) {
    const postId = req.params.postId;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    const loggedInUserId = decoded.userId;
    try {
        const post = await postModel.findById(postId).populate('likes');
        for (let i = 0; i < post.likes.length; i++) {
            const likedUser = await userModel.findById(post.likes[i]);
            likedUser.likedPost = likedUser.likedPost.filter(likedPost => likedPost.toString() !== postId);
            await likedUser.save();
        }
        // Now delete the post
        const user = await userModel.findById(loggedInUserId);
        user.post = user.post.filter(id => id.toString() !== postId);
        await user.save();
        const imagePath = path.join(__dirname, 'public', 'images', 'uploads', post.image);
        fs.unlinkSync(imagePath);
        await postModel.findByIdAndDelete(postId);
        res.status(201).json({ message: "Post and related likes removed successfully", postId });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


/* follow handling route */
app.get('/api/follow/:username', async function (req, res) {
    const username = req.params.username;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey);
    const loggedInUsername = decoded.username;
    try {
        let loggedInUser = await userModel.findOne({ username: loggedInUsername });
        let user = await userModel.findOne({ username: username });

        if (loggedInUser.following.includes(user._id)) {
            loggedInUser.following = loggedInUser.following.filter((id) => id.toString() !== user._id.toString());
            user.followers = user.followers.filter((id) => id.toString() !== loggedInUser._id.toString());
            await loggedInUser.save();
            await user.save();
            res.status(201).json({ message: "Unfollowed", status: "Follow", followerCount: user.followers.length });
        } else {
            loggedInUser.following.push(user._id);
            user.followers.push(loggedInUser._id);
            await loggedInUser.save();
            await user.save();
            res.status(201).json({ message: "Followed", status: "Following", followerCount: user.followers.length });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


/* feed page post route */

app.get('/api/feed', async function (req, res) {
    try {
        const posts = await postModel.find();
        res.status(201).json({ message: "post fetched successfully", posts: posts.reverse() });
    } catch (error) {
        res.status(500).json({ error: "Internal error occurs" });
    }
})

const port = process.env.PORT || 3000;
//server listening at port 3000
app.listen(port);