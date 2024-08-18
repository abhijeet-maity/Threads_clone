import { Avatar, Flex, Text} from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedChatAtom} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';

const Message = ({ownMessage, msg}) => {

  const selectedChat = useRecoilValue(selectedChatAtom);
  const currentUser = useRecoilValue(userAtom);

  return (
    <>
    {ownMessage ? (
      <Flex gap={2} alignSelf={'flex-end'}>
      <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"} >
        {msg.text}
      </Text>
      <Avatar src={currentUser.profilePic} w={7} h={7}/>
      </Flex>
      ) 
      : 
      (<Flex gap={2} >
        <Avatar src={selectedChat.userProfilePic} w={7} h={7}/>
        <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"} >
          {msg.text}
        </Text>
        
        </Flex>
      )}
    
    </>
  )
}

export default Message
