import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Profile from './components/Profile/Profile.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import EditProfile from './components/EditProfile/EditProfile.jsx';
import CreatePost from './components/CreatePost/CreatePostPage.jsx';
import 'react-loading-skeleton/dist/skeleton.css'
import SearchPage from './components/SearchPage/SearchPage.jsx';
import ViewPost from './components/ViewPost/ViewPost.jsx';
import Feed from './components/Feed/Feed.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '/Login',
        element: <Login/>
      },
      {
        path: '/Signup',
        element: <SignUp/>
      },
      {
        path: '/',
        element: <Feed/>
      },
      {
        path: '/search',
        element: <SearchPage/>
      },
      {
        path: '/create-post',
        element: <CreatePost/>
      },
      {
        path: '/profile/edit',
        element: <EditProfile/>
      },
      {
        path: '/post/:post_Id',
        element: <ViewPost/>
      },
      {
        path: '/profile/:username',
        element: <Profile/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider  router={router} />
  </React.StrictMode>,
)
