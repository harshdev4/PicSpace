# Instagram-like Full Stack Project Documentation

This project replicates some functionalities of Instagram, allowing users to sign up, log in, upload photos, like uploaded photos, view other users' profiles, and edit their own profiles. It is built with Vite for the frontend, Node.js with Express.js for the backend, Multer for photo upload handling, and MongoDB for the database.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites) 
4. [Setup Instructions](#setup-instructions)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Contributing](#contributing)
8. [License](#license)

## Features
1. **User Authentication:**
   - Users can sign up for an account.
   - Users can log in using their credentials.
   - JSON Web Tokens (JWT) are used for authentication and authorization.

2. **Profile Management:**
   - Users can edit their profile information such as fullname, bio, profile picture, etc.

3. **Photo Upload:**
   - Users can upload photos to their profiles.
   - Multer middleware is used for handling file uploads.

4. **Photo Interaction:**
   - Users can like photos uploaded by other users.
   - Users can view profiles of other users.
   
## Technologies Used
- **Frontend:** Vite (React.js)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Upload Handling:** Multer
- **Authentication:** JSON Web Tokens (JWT)

## Prerequisites
Before you begin, ensure you have  met the following requirements:
1. Node.js installed.
2. MongoDB installed and running.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/harshdev4/Instagram.git
   ```

2. Navigate to the project directory:
   ```bash
   cd backend
   ```

3. Install server dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   npx nodemon
   ```
   

7. Navigate to the client directory:
   ```bash
   cd frontend
   ```

8. Install client dependencies:
   ```bash
   npm install
   ```

9. Start the client:
   ```bash
   npm run dev
   ```

## Usage
- **Server will start at `http://localhost:3000`
- **Once the server and client are running, navigate to `http://localhost:${port_given_by_React}` in your web browser to access the application. From there, you can sign up, log in, upload photos, interact with photos, and manage your profile.

## API Endpoints

### Profile Management

#### Get User Profile
- **GET /api/profile/:username**: Retrieves the profile information of a user based on their username.

#### Search Users
- **GET /api/getUser/:fullname**: Retrieves users whose full name matches the provided string.
- **GET /api/getUser/**: Retrieves an empty array when no string is provided for searching users.

#### Logout
- **GET /api/logout**: Logs out the user by clearing the token from the cookie.

### Registration and Login

#### Register New User
- **POST /api/register**: Registers a new user account with the provided email, username, full name, and password.

#### Login User
- **POST /api/login**: Logs in an existing user with the provided username and password.

### Profile Editing

#### Edit Profile Picture
- **POST /api/profile/editPic**: Allows the user to edit their profile picture by uploading a new image.

#### Edit Profile Information
- **POST /api/profile/edit**: Allows the user to edit their full name and profile bio.

### Post Management

#### Create Post
- **POST /api/create-post**: Allows the user to create a new post by uploading an image and providing a caption.

#### View Posts

##### User Posts
- **GET /api/getPost/:username**: Retrieves posts of a user based on their username.

##### Liked Posts
- **GET /api/getPost/:username/likedPost**: Retrieves posts liked by a user based on their username.

#### Interaction with Posts

##### View Full Post
- **GET /api/viewPost/:postId**: Retrieves a full post by post ID.

##### Like/Unlike Post
- **GET /api/like/:postId**: Handles liking/unliking a post by post ID.

### Feed Display
- **GET /api/feed**: Retrieves posts for the feed page.


## Contributing
Contributions are welcome! Feel free to open issues or pull requests.

## License
This project is licensed under the [MIT License].
