import React from 'react';
import { useState } from 'react';
import { Flex, Text, Avatar, Divider} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

const comment = ({reply, lastReply}) => {

    // const[liked, setLiked] = useState(false);

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"}/>
        <Flex flexDirection={"column"} gap={1} w={"full"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize="sm" fontWeight="bold">{reply.username}</Text>
                
            </Flex>
            <Text>{reply.text}</Text>
            
        </Flex>
      </Flex>
      {!lastReply ?  <Divider my={4}/> : null}
      {/* <Divider my={4}/> */}
    </>
  )
}

export default comment
