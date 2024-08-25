import React from 'react';
import SearchedUser from './SearchedUser';
import { Button, Flex, Skeleton, SkeletonCircle, Text, Box } from '@chakra-ui/react';

const DisplayUserList = ({title,text,loadingUsers,list,display,btntext,setUserstoToggle}) => {
  return (
    <Flex  flexDirection={"column"} >
            <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>{title}</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>{text}</Text>
            </Box>
            <Button size={{base:"xs",md:"sm"}} p={{base:"4", md:"5"}} colorScheme='blue' onClick={()=>setUserstoToggle(prev => !prev)}>{btntext}</Button>
            </Flex>
            {display && (
            <Flex flexDirection={"column"} gap={4} pt={6}>
            {loadingUsers && [1,2,3,4,5].map((_,i) => (
           <Flex key={i} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
           <Box>
               <SkeletonCircle size={"10"}/>
           </Box>
           <Flex w={"full"} flexDirection={"column"} gap={3}>
               <Skeleton h={"12px"} w={"80px"}/>
               <Skeleton h={"10px"} w={"70%"}/>
           </Flex>
           <Flex>
            <Skeleton h={"28px"} w={"60px"}/>
           </Flex>
        </Flex> 
        ))}

        {!loadingUsers && list.map((user) => <SearchedUser key={user._id} user={user}/>)}
            </Flex>
        )}

        </Flex>
  )
}

export default DisplayUserList;

