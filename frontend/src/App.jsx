import './App.css'
import { Outlet } from 'react-router-dom'
import UserContextProvider from './context/userContext';
import FeedContextProvider from './context/feedContext';
import Navbar from './components/Navbar/Navbar';
import TopLogo from './components/TopLogo/TopLogo';
import { useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <UserContextProvider>
      <FeedContextProvider>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/profile/edit' && <TopLogo/>}
      <Navbar></Navbar>
      <Outlet></Outlet>
      </FeedContextProvider>
    </UserContextProvider>
  )
}

export default App
