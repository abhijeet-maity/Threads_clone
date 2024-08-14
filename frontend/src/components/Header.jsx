import React from 'react';
import { Flex, Image, useColorMode} from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link, Navigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import LogoutButton from './LogoutButton';
import authScreenAtom from '../atoms/authAtom';
import { BsFillChatQuoteFill } from 'react-icons/bs';


const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const currUser = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  console.log("Current color mode:", colorMode);
  console.log("Image source:", colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg");
  
  return (
    <Flex justifyContent={"space-between"} ml={2} mt={8} mb="12">
      {currUser && (
				<Link to='/'>
					<AiFillHome size={26} />
				</Link>
			)}

    {!currUser && (
				<Link to={"/authPage"} onClick={() => {
          setAuthScreen('login');
        }}>
					Login
				</Link>
			)}

        {currUser ? (<Image 
            cursor={"pointer"}
            alt='logo'
            w={7}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        />) : (
        <Flex justifyContent={"center"} alignItems={"center"} w={"full"}><Image 
          cursor={"pointer"}
          alt='logo'
          w={70}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
        </Flex>)}
        
      {currUser ? (
        <Flex alignItems={"center"} gap={4}>
        <Link  to={currUser.username}>
					<RxAvatar size={26} />
				</Link>
        <Link  to={`/chat`}>
					<BsFillChatQuoteFill size={25} />
				</Link>
        <LogoutButton/>
        </Flex> 
			) : (<Navigate to='/authpage'/>)}

      {!currUser && (
				<Link to={"/authpage"} onClick={() => {
          setAuthScreen('signup');
        }}>
					SignUp
				</Link>
			)}

    </Flex>
  )
}

export default Header;
