import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import Message from './Message'
import MessageInput from './MessageInput'


const MessageContainer = () => {
  return (
    <Flex flex="70" 
    bg={useColorModeValue("gray.200", "gray.dark")}
    borderRadius={"md"}
    flexDirection={"column"}
    px={2}>
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src='' size={"sm"}/>
        <Text display={"flex"} alignItems={"center"} >
            johnDuckket <Image src='/verified.png' w={4} h={4} ml={1}/>
        </Text>
      </Flex>
      <Divider/>
      <Flex flexDirection={"column"} gap={4} my={2} p={3} height={"488px"} overflowY={"auto"}>
        {false  && (
            [...Array(5)].map((_, i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={2} borderRadius={"md"} alignSelf={ i%2 === 0 ? "flex-start" : "flex-end" }>

                    {i % 2 === 0 && <SkeletonCircle size={8} />}
                    <Flex flexDirection={"column"} gap={2}>
                        <Skeleton h="8px" w="250px" />
                        <Skeleton h="8px" w="250px"/>
                        <Skeleton h="8px" w="250px"/>
                    </Flex>
                    {i % 2 !== 0 && <SkeletonCircle size={8} />}

                </Flex>
            ))
        )}
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>
      </Flex>
      <MessageInput/>
    </Flex>
  )
}

export default MessageContainer
