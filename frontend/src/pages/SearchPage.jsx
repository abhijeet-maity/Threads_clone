import React from 'react';
import { useState} from 'react';
import {Flex, Input, Button, SkeletonCircle, Box, Skeleton,} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import userAtom from '../atoms/userAtom';
import {useRecoilValue} from "recoil";
import usePopToast from "../customHooks/usePopToast";
import SearchedUser from '../components/SearchedUser';

const SearchPage = () => {

    const [searchUserText, setSearchUserText] = useState("");
    const [loading, setLoading] = useState(false);
    const [foundUsers, setFoundUsers] = useState([]);
    const loggedInUser = useRecoilValue(userAtom);
    const popToast = usePopToast();

    // useEffect(() =>{
    //     console.log(foundUsers);
    // },[foundUsers]);

    const searchUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(searchUserText);
        try {
          const res = await fetch(`/api/users/getMultipleUsersProfiles/${searchUserText}`);
          const data = await res.json();
  
          if(data.error) {
            popToast("Error", data.error, "error");
            return; 
          }
          console.log(data);
          //We are searching ourselves.
          if (data.some(user => user._id === loggedInUser._id)) {
            popToast("Error", "You cannot search yourself", "error");
            return;
          }
          setFoundUsers(data);
        
        } catch (error) {
          popToast("Error", error.message, "error");
        } finally{
          setLoading(false); 
        }
      }

  return (
    <Flex gap={6} flexDirection={"column"} p={4}>
        <form action="" onSubmit={searchUser}>
                <Flex alignItems={"center"} gap={2}>
                    <Input placeholder='Search user' onChange={(e) => setSearchUserText(e.target.value)}/>
                    <Button size={"md"}  onClick={searchUser} isLoading={loading}>
                        <SearchIcon />
                    </Button>
                </Flex>
        </form>
        <Flex flexDirection={"column"} gap={6}>
        {loading && [1,2,3,4,5].map((_,i) => (
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

         {!loading && foundUsers.map((user) => <SearchedUser key={user._id} user={user}/>)} 
        
        </Flex>

    </Flex>
  )
}

export default SearchPage;
