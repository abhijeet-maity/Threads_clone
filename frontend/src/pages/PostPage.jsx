import { useEffect, useState } from 'react';
import { Flex, Avatar, Text, Image, Box, Divider, Button, Spinner} from '@chakra-ui/react';
// import { BsThreeDots } from 'react-icons/bs';
import { DeleteIcon } from "@chakra-ui/icons";
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import usePopToast from "../customHooks/usePopToast";
import { useNavigate, useParams } from 'react-router-dom';
import {formatDistanceToNow} from "date-fns";
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { color } from 'framer-motion';
import postsAtom from '../atoms/postsAtom';




const PostPage = () => {

  // const [liked, setLiked] = useState(false);
  const popToast = usePopToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();
  const {pid} = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getCurrUser = async () => {
        try {
          const res = await fetch(`/api/users/getprofile/${username}`);
          const data = await res.json();
          console.log(data);

          if(data.error) {
            popToast("Error", data.error,"error");
            return;
          }

          setUser(data);
          console.log(user);
        } catch (e) {
          console.log(e);
          popToast("Error",e.message,"error");
        } finally {
          setLoading(false);
        }
    };


    const getPost = async() => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        //getting single post as single object
        console.log(data);

        if(data.error) {
          popToast("Error", error.message, "error");
        }

        // console.log(data);
        // initializing our global state with an array of post object.
        setPosts([data]);
        console.log(posts);
      } catch (error) {
        popToast("Error",error.message,"error");
      }
    };

    getCurrUser(); 
    getPost();
  },[username, popToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      //confirming user to be delete the post.
      if(!window.confirm('Are you sure you want to delete ?')) return;
  
      const res = await fetch(`/api/posts/${currentPost._id}`,{
        method : 'DELETE',
  
      });
      const data = await res.json();
  
      if(data.error) {
        return popToast("Error", data.error, "error");
      }
  
      popToast("Success", "Post Deleted Successfully", "success");
      navigate(`/${user.username}`);
  
  
    } catch (error) {
      popToast("Error", error.message, "error");
    }
  };

  if(!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  if(!currentPost) return null;

  return (
    <>
      <Flex>
          <Flex w={"full"} gap={3} alignItems={"center"}>
            {/* src='/zuck-avatar.png' */}
            <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg"/>
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"} >{user.username}</Text>
              <Image w="4" h={4} ml={4} src="/verified.png"/>
            </Flex>
          </Flex>


          <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"xs"} color={"gray.light"} width={36} textAlign={"right"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text> 
                  {currUser?._id === user._id && (<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>)}
          </Flex>

      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost.img} w={"full"}/>
        </Box>
      )}

      

      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>

      
      <Divider my={4}/>

      <Flex justifyContent={"space-between"} >
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>
          👋
          </Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>
      <Text fontSize={"xs"} color={"gray.light"}>You are reading below comments on this post</Text>

      {currentPost.replies.map(reply => (
        <Comment 
        key={reply._id}
        reply={reply}
        lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
      />
      ))}

      {/* <Comment 
        comment="Looks really good"
        createdAt="2d"
        likes={100}
        username="johnDoe"
        userAvatar='https://bit.ly/dan-abramov'  
      /> */}
      
      
      


    </>
  )
}

export default PostPage;
