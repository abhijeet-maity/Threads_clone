import React from 'react';
import UserPost from '../components/UserPost';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import usePopToast from '../customHooks/usePopToast';
import { Flex, Spinner } from "@chakra-ui/react";
import postsAtom from '../atoms/postsAtom';
import { useRecoilState } from 'recoil';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// Lazy load the components
const UserHeader = lazy(() => import('../components/UserHeader'));
const Post = lazy(() => import('../components/Post'));

const UserPage = () => {

  const currUser = useRecoilValue(userAtom); // logged in user
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

        //Not to display user Page if account is been frozen.
        // if(data.isFrozen) {
        //   setUser(null);
        //   return;
        // }

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
  // console.log("posts is here ", posts);


  if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}


  if(!user && !loading){
    return <h1>User Not Found</h1>
  }

  return (
    <>
      <Suspense fallback={<Spinner size="xl" />}>
        <UserHeader user={user} />
      </Suspense>

      {!fetchingUserPosts && posts.length === 0 && <Flex flexDirection={"column"} textAlign={"center"} m={70}>{
        user._id === currUser._id ? (<h1>No Posts yet, Create your First Post by clicking on the "+" button below</h1>) : (<h1>User has no posts yet</h1>)
        }
        </Flex>}
      {fetchingUserPosts && (<Flex justifyContent={"center"} my={12}>
				<Spinner size={"xl"} />
			</Flex>)}

      <Suspense fallback={<Spinner size="xl" />}>
        {Array.isArray(posts) && posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Suspense>
    </>
  )
}

export default UserPage;

