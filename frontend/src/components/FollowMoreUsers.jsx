import React from 'react';
import { useState, useEffect } from 'react';  
import { Text, Flex, Box, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import FollowUser from './FollowUser';
import usePopToast from '../customHooks/usePopToast';

const FollowMoreUsers = () => {

    const [loading, setLoading] = useState(true);
    const [followUserList, setFollowUserList] = useState([]);
    const popToast = usePopToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/suggestedusers");
                const data = await res.json();

                if(data.error){
                    popToast("Error",data.error,"error");
                }
                console.log(data);

                setFollowUserList(data);
            } catch (error) {
                popToast("Error", error.message, "error");
            } finally{
              setLoading(false);
            }
        }

        getSuggestedUsers();
    },[popToast]);


  return (
    <>
      <Text mb={4} fontWeight={"bold"}>Follow Some Users</Text>
      <Flex direction={"column"} gap={4}>
        {loading && followUserList.map((_,i) => (
           <Flex key={i} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
           <Box>
               <SkeletonCircle size={"10"}/>
           </Box>
           <Flex w={"full"} flexDirection={"column"} gap={3}>
               <Skeleton h={"10px"} w={"80px"}/>
               <Skeleton h={"8px"} w={"90%"}/>
           </Flex>
           <Flex>
            <Skeleton h={"20px"} w={"60px"}/>
           </Flex>
       </Flex> 
        ))}

        {!loading && followUserList.map((user) => <FollowUser key={user._id} user={user}/>)}

      </Flex>
    </>
  )
}

export default FollowMoreUsers
