import React, { useState } from 'react';
import { Flex, Spinner} from "@chakra-ui/react";
// import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import usePopToast from '../customHooks/usePopToast';
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";



const HomePage = () => {
  const popToast = usePopToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  // const [posts, setPosts] = useState([]);
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

//
  return (

    <>
      {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
      {loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
			)}
      
      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}

    </>
    // <Link to={"/markzuckerberg"}>
    //   <Flex w={"full"} justifyContent={"center"}>
    //     <Button mx={"auto"}>Visit Profile Page</Button>
    //   </Flex>
    // </Link>
  );
};

export default HomePage
