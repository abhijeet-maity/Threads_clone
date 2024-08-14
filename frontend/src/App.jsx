
import { Box, Button } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from "./components/Header";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
function App() {

  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <Box position={"relative"} w={"full"}>
    <Container maxW='620px'>
      <Header/>
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
    </Routes>

    {/* {user ? <LogoutButton/> : <Navigate to='/authpage'/>} */}
    {/* {user && <CreatePost/>} */}

    {/* <Navigate to='/authpage'/> */}
    </Container>
    </Box>
    
  )
}

export default App
