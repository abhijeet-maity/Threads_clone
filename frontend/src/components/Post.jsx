import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import Actions from "./Actions";
import usePopToast from "../customHooks/usePopToast";
import {formatDistanceToNow} from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({post, postedBy}) => {
//
  // const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const currUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const popToast = usePopToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch("/api/users/getprofile/" + postedBy);
            const data = await res.json();
            // console.log(data);
            if (data.error) {
                popToast("Error", data.error, "error");
                return;
            }
            setUser(data);
        } catch (error) {
            popToast("Error", error.message, "error");
            setUser(null);
        }
    };

    getUser();
}, [postedBy, popToast]);

const handleDeletePost = async (e) => {
  try {
    e.preventDefault();
    //confirming user to be delete the post.
    if(!window.confirm('Are you sure you want to delete ?')) return;

    const res = await fetch(`/api/posts/${post._id}`,{
      method : 'DELETE',

    });
    const data = await res.json();

    if(data.error) {
      popToast("Error", data.error, "error");
      return;
    }

    popToast("Success", "Post Deleted Successfully", "success");
    setPosts(posts.filter((p) => p._id !== post._id));


  } catch (error) {
    popToast("Error", error.message, "error");
  }
};

if(!user) {
  return null;
}

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name={user.name} src={user?.profilePic} 
          onClick={(e)=>{
            e.preventDefault();
            navigate(`/${user.username}`)
          }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            
          {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
            
          </Box>
        </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Flex w={"full"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"} onClick={(e)=>{
            e.preventDefault();
            navigate(`/${user.username}`);
          }}
                    >{user?.username}</Text>
                    <Image src="/verified.png" w={4} h={4} ml={1} />
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                  <Text fontSize={"xs"} color={"gray.light"} width={36} textAlign={"right"}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text> 
                  {currUser?._id === user._id && (<DeleteIcon size={20} onClick={handleDeletePost}/>)}
                  
                  {/* <DeleteIcon size={20} /> */}
                </Flex>
            </Flex>
            
      
            <Text fontSize={"sm"}>{post.text}</Text>
            {post.img && <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image w={"full"} src={post.img} />
            </Box>}
            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>


            

          </Flex>
      
      </Flex>
    </Link>
  );
};

export default Post;
//