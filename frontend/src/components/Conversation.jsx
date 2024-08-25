import { Avatar, AvatarBadge, Flex, Image, Stack, Text, Box, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import {BsCheck2All} from "react-icons/bs";
import { BsFillImageFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from 'recoil';
import {selectedChatAtom} from '../atoms/messagesAtom';

const Conversation = ({conversation, isOnline}) => {

  const chatPartner = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const loggedInUser = useRecoilValue(userAtom)
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);


  console.log("selectedChat", selectedChat);
  console.log(lastMessage);
  return (
    <Flex gap={4} alignItems={"center"} p={"1"} _hover={{cursor: "pointer", 
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white"
    }} onClick={() => setSelectedChat({
      _id : conversation._id,
      userId : chatPartner._id,
      userProfilePic : chatPartner.profilePic,
      username : chatPartner.username,
      new : conversation.new,
    })} borderRadius={"md"}
    bg={selectedChat?._id === conversation._id ? useColorModeValue("gray.600","gray.dark") : ""}>
      <WrapItem>
        <Avatar size={{base: "xs", sm: "sm", md: "md"}} src={chatPartner?.profilePic}>
            {isOnline ? <AvatarBadge boxSize={"0.8em"} bg={"green.500"}/> : ""}
            {/* <AvatarBadge boxSize={"0.8em"} bg={"green.500"}/> */}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontSize="12" display={"flex"} alignItems={"center"}>
            {chatPartner?.username} <Image src='/verified.png' w={4} h={4} ml={1}/>
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {loggedInUser._id === lastMessage.sender ? (
              <Box color={lastMessage.seen ? "blue.400" : ""}>
                <BsCheck2All size={15}/>
              </Box>
            ) : ""}
            {lastMessage.text.length > 20 ? lastMessage.text.substring(0, 18) + "..." : lastMessage.text || <BsFillImageFill size={18}/>}
        </Text>
      </Stack>

    </Flex>
  )
}

export default Conversation
