
import { Box, Container} from "@chakra-ui/react";
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Suspense, lazy } from 'react';
import Header from "./components/Header";
import "./App.css";
import LogoutButton from "./components/LogoutButton";

// Optimized by using Code splitting & Lazy loading pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const UpdateProfilePage = lazy(() => import('./pages/UpdateProfilePage'));
const CreatePost = lazy(() => import('./components/CreatePost'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

function App() {

  const user = useRecoilValue(userAtom);
  console.log(user);
  const {pathname} = useLocation();        
  return (
    <Box position={"relative"} w={"full"}>
    <Container maxW={pathname === "/" ? {base: "620px", md: "900px"} : "650px"}>
      <Header/>
      <Suspense fallback={
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        }>
      <Routes>
       <Route path='/' element={user ? <HomePage/> : <Navigate to='/authpage'/>} />
       <Route path='/authpage' element={!user ? <AuthPage/> : <Navigate to='/'/>} />
       <Route path='/update' element={user ? <UpdateProfilePage/> : <Navigate to='/authpage'/>} />
       <Route path="/:username"  element={ user ? (
        <>
          <UserPage/>
          <CreatePost/>
        </>  
       ) : (
       <userPage/>
       ) 
       }/> 
       <Route path="/:username/post/:pid" element={<PostPage/>}/>
       <Route path="/chat" element={ user ? <ChatPage/> : <Navigate to='/authpage'/>}/>
       <Route path="/searchUser" element={ user ? <SearchPage/> : <Navigate to='/authpage'/>}/>
       <Route path="/settings" element={ user ? <SettingsPage/> : <Navigate to='/authpage'/>}/>
    </Routes>
    </Suspense>

    {/* {user ? <LogoutButton/> : <Navigate to='/authpage'/>} */}
    {/* {user && <CreatePost/>} */}

    {/* <Navigate to='/authpage'/> */}
    </Container>
    </Box>
    
  )
}

export default App
