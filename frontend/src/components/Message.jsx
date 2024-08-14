import { Avatar, Flex, Text} from '@chakra-ui/react'
import React from 'react'

const Message = ({ownMessage}) => {
  return (
    <>
    {ownMessage ? (
      <Flex gap={2} alignSelf={'flex-end'}>
      <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"} >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam, explicabo non ab animi consectetur error eos maiores excepturi 
      </Text>
      <Avatar src='' w={7} h={7}/>
      </Flex>
      ) 
      : 
      (<Flex gap={2} >
        <Avatar src='' w={7} h={7}/>
        <Text maxW={"350px"} bg={"red.400"} p={1} borderRadius={"md"} >
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam, explicabo non ab animi consectetur.
          atione 
        </Text>
        
        </Flex>
      )}
    
    </>
  )
}

export default Message
