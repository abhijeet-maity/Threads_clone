import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import {BsCheck2All} from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from 'recoil';
import {selectedChatAtom} from '../atoms/messagesAtom';

const Conversation = ({conversation}) => {

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
    })} borderRadius={"md"}
    bg={selectedChat?._id === conversation._id ? useColorModeValue("gray.600","gray.dark") : ""}>
      <WrapItem>
        <Avatar size={{base: "xs", sm: "sm", md: "md"}} src={chatPartner?.profilePic}>
            <AvatarBadge boxSize={"0.8em"} bg={"green.500"}/>
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontSize="12" display={"flex"} alignItems={"center"}>
            {chatPartner?.username} <Image src='/verified.png' w={4} h={4} ml={1}/>
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {loggedInUser._id === lastMessage.sender ? <BsCheck2All size={15} /> : ""}
            {lastMessage.text.length > 20 ? lastMessage.text.substring(0, 20) + "..." : lastMessage.text}
        </Text>
      </Stack>

    </Flex>
  )
}

export default Conversation
