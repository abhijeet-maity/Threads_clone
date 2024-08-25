import React, { useState } from 'react';
import {Box, Flex, VStack, Avatar, Text, Link, Portal, Menu, MenuButton, MenuList, MenuItem, Button, useColorMode} from "@chakra-ui/react";
import {BsInstagram} from "react-icons/bs";
import {CgMoreO} from "react-icons/cg";
import { useToast } from '@chakra-ui/react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import "../index.css";
import { Link as RouterLink } from "react-router-dom";
import usePopToast from '../customHooks/usePopToast'


const UserHeader = ({user}) => {

    
    const currUser = useRecoilValue(userAtom); // logged in user
    const [following, setfollowing] = useState(user.followers.includes(currUser?._id));
    const [updating, setUpdating] = useState(false);
    const {colorMode} = useColorMode();
    const toast = useToast();
    const popToast = usePopToast();

    console.log("following : ", following);
    console.log(currUser);
//
    const copyUrl = () => {
        const pageUrl = window.location.href;
        console.log(pageUrl);
        navigator.clipboard.writeText(pageUrl).then(() => {
            toast({
                title: 'Link copied.',
                description: "Linked copied successfully in your clipboard.",
                status: 'success',
                duration: 800,
                isClosable: true,
            })
            console.log("URL Copied successfully");
            
        }).catch(() => {
            console.log("OOOPPPS, an error occurred");
        });
    };

    const handleFollowUnFollow = async () => {
        if(!currUser){
            popToast("Error","Please Login to follow", "error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`,{
                method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
            })

            const data = await res.json();
            if (data.error) {
				popToast("Error",data.error, "error");
				return;
			}

            if(following) {
                popToast("Success",`Unfollowed ${user.name}`,"success");
                user.followers.pop();
            } else {
                popToast("Success",`Followed ${user.name}`,"success");
                user.followers.push(currUser?._id);
            }
            setfollowing(!following);
            console.log(data);
        } catch (e) {
            popToast("ERROR", e, "error");
        } finally {
            setUpdating(false);
        }
    }

  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} mb={3} fontWeight={"bold"}>
                    {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"} mt={2}>{user.username}</Text>
                    <Text fontSize={"xs"} bg={ colorMode !== "dark" ? "lightBlue" : "gray.dark"} color={"gray.light"} mt={2} p={1} pr={2} pl={2} borderRadius={"full"}>
                    threads.net
                    </Text>
                </Flex>
            </Box>
            <Box>
                {user.profilePic && (<Avatar
                    name={user.name}
                    src={user.profilePic}
                    size={{base:"lg", md: "xl"}}/>
                )} 
                {!user.profilePic && (<Avatar
                    name={user.name}
                    src="https://bit.ly/broken-link"
                    size={{base:"md", md: "xl"}}/>
                )}

            </Box>
        </Flex>
        <Text letterSpacing={".7px"} fontSize={{base:"12px", md : "16px"}}>{user.bio}</Text>
        {currUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button p={4} size={{base : "xs", md : "md"}} bg={ colorMode !== "dark" ? "tomato" : "gray.dark"}
                        color={"white"}>Update Profile</Button>
				</Link>
		)}
        {currUser?._id !== user._id && (
			<Button size={"md"} onClick={handleFollowUnFollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
		)}
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                <Box bg={"gray.light"} w={1} h={1} borderRadius={"full" }></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icons-background'>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
                
                <Box className='icons-background'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={copyUrl}>Copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
        <Flex w={"full"} >
            <Flex flex={1} borderBottom={"1.6px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader
