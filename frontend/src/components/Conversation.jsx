import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import {BsCheck2All} from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from 'recoil';

const Conversation = ({conversation}) => {

  const chatPartner = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const loggedInUser = useRecoilValue(userAtom)
  return (
    <Flex gap={4} alignItems={"center"} p={"1"} _hover={{cursor: "pointer", 
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white"
    }} borderRadius={"md"}>
      <WrapItem>
        <Avatar size={{base: "xs", sm: "sm", md: "md"}} src={chatPartner.profilePic}>
            <AvatarBadge boxSize={"0.8em"} bg={"green.500"}/>
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontSize="12" display={"flex"} alignItems={"center"}>
            {chatPartner.username} <Image src='/verified.png' w={4} h={4} ml={1}/>
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
