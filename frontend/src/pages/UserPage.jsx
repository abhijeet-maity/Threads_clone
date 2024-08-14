import React from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import usePopToast from '../customHooks/usePopToast';
import { Flex, Spinner } from "@chakra-ui/react";
import Post from '../components/Post';
import postsAtom from '../atoms/postsAtom';
import { useRecoilState } from 'recoil';


const UserPage = () => {

  const[user, setUser] = useState();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const {username} = useParams();
  const popToast = usePopToast();
  const [loading, setLoading] = useState(true);
  const [fetchingUserPosts, setFetchingUserPosts] = useState(true);

  useEffect(() => {


    const getUser = async () => {

      try {
        const res = await fetch(`/api/users/getprofile/${username}`);
				const data = await res.json();
				console.log(data);
        if(data.error) {
          popToast("Error", data.error,"error");
          return;
        }
        setUser(data);
      } catch (e) {
        console.log(e);
        popToast("Error",e.message,"error");
      } finally {
        setLoading(false);
      }
    };

    const getUserPosts = async () => {
      setFetchingUserPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        //array of users post will be stored in the data variable.
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.log(error);
        popToast("Error", error.message,"error");
        setPosts([]);
      } finally {
        setFetchingUserPosts(false); 
      }
    };

    getUser();
    getUserPosts();
  },[username, popToast, setPosts]);
  console.log("posts is here ", posts);


  if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

//lninh+
  if(!user && !loading){
    return <h1>User Not Found</h1>
  }

  return (
    <>
      <UserHeader user={user}/>

      {!fetchingUserPosts && posts.length === 0 && <Flex flexDirection={"column"} textAlign={"center"} m={70}>
        <h1>You have No Posts</h1><h2>Create your First Post By clicking on the create post button below</h2></Flex>}
      {fetchingUserPosts && (<Flex justifyContent={"center"} my={12}>
				<Spinner size={"xl"} />
			</Flex>)}

      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default UserPage
