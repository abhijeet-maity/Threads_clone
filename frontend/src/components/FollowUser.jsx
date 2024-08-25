import React from 'react';
import { useState } from 'react';
import {Text, Box, Avatar, Button, Flex} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePopToast from '../customHooks/usePopToast';

const FollowUser = ({user}) => {
	const currUser = useRecoilValue(userAtom); // logged in user
    const [following, setfollowing] = useState(user.followers.includes(currUser?._id));
    const [updating, setUpdating] = useState(false);
	const popToast = usePopToast();
    
    


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
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				fontSize={"12px"}
				padding={following ? "7px" : "14px"}
				onClick={handleFollowUnFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
  )
}

export default FollowUser

