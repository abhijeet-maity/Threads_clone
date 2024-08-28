import React, { lazy, Suspense, useState } from 'react';
import { Flex, Spinner, Box} from "@chakra-ui/react";
import { useEffect } from 'react';
import usePopToast from '../customHooks/usePopToast';
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";


// Lazy load the Post and FollowMoreUsers components
const Post = lazy(() => import("../components/Post"));
const FollowMoreUsers = lazy(() => import('../components/FollowMoreUsers'));

const HomePage = () => {
  const popToast = usePopToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        console.log(res);
				const data = await res.json();
        console.log(data);
				if (data.error) {
					popToast("Error", data.error, "error");
          console.log(data.error);
					return;
				}
        //holds array of all the posts of people followed by user
				
				setPosts(data);
        console.log(posts);
        console.log(typeof posts);
      } catch (error) {
        popToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [popToast,setPosts])

  return (

    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
      {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
      {loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
			)}
      <Suspense fallback={<Spinner size='xl' />}>
      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      </Suspense>
      </Box>
      <Box flex={30} display={{base:"none", md:"block"}}>
      <Suspense fallback={<Spinner size='lg' />}>
        <FollowMoreUsers />
      </Suspense>
      </Box>

    </Flex>
    
  );
};

export default HomePage
