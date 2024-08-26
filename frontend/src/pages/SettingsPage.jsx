import React from 'react';
import { useState, useEffect } from 'react';
import { Text, Button, Flex, Box, useColorMode} from '@chakra-ui/react';
import usePopToast from '../customHooks/usePopToast';
import useLogout from "../customHooks/useLogout";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import DisplayUserList from '../components/DisplayUserList';

const SettingsPage = () => {
    const [getFollowers, setGetFollowers] = useState(false);
    const [myFollowers, setMyFollowers] = useState([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [getFollowing, setGetFollowing] = useState(false);
    const [myFollowing, setMyFollowing] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);
    const {colorMode, toggleColorMode} = useColorMode();
    const logout = useLogout();
    const popToast = usePopToast();
    const user = useRecoilValue(userAtom);

    const freezeMyAccount = async () => {
        if(!window.confirm('Are you sure you want to freeze your account?')) {
            return;
        }

        try {
            const res = await fetch("api/users/freeze",{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
            })
            const data = await res.json();

            if(data.error) {
                return popToast("Error", data.error, "error");
            }

            if(data.success) {
                await logout();
                popToast("Success", "Your Account has been frozen", "success");
            }

        } catch (error) {
            popToast("Error", error.message, "error");
        }
    }

    const displayFollowers = async () => {
        
        // setGetFollowers((prev) => !prev);
        console.log(user.username);
        try {
            setLoadingFollowers(true);
            const res = await fetch(`/api/users/getfollowers/${user.username}`);
            const data = await res.json();
            console.log(data);
            setMyFollowers(data);
            if(data.error) {
              popToast("Error", data.error,"error");
              return;
            }
            
          } catch (e) {
            popToast("Error",e.message,"error");
          } finally{
            setLoadingFollowers(false);
          }
    }

    const displayFollowing = async () => {
        
        // setGetFollowing((prev) => !prev);
        console.log(user.username);
        try {
            setLoadingFollowing(true);
            const res = await fetch(`/api/users/getfollowing/${user.username}`);
            const data = await res.json();
            console.log(data);
            setMyFollowing(data);
            if(data.error) {
              popToast("Error", data.error,"error");
              return;
            }
            
          } catch (e) {
            popToast("Error",e.message,"error");
          } finally{
            setLoadingFollowing(false);
          }
    }

    const deleteAccount = async () => {
      if(!window.confirm('Are you sure you want to delete your account?')) {
        return;
      }
      try {
        const res = await fetch('api/users/delete',{
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();

        if(data.error) {
          return popToast("Error", data.error, "error");
        }

        if(data.success) {
          await logout();
          popToast("Success", "Your Account has been Deleted", "success");
        }
      } catch (error) {
        popToast("Error", error.message, "error");
      }
    }

    useEffect(() => {
      displayFollowers();
      displayFollowing();
    }, []);

  return (
    <Flex flexDirection={"column"}>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Freeze Your Account</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can unfreeze your account anytime by simply logging in.</Text>
            </Box>
            <Button size={{base:"sm",md:"md"}} p={{base:"4", md:"5"}} pl={"9"} pr={"9"} colorScheme='red' onClick={freezeMyAccount}>Freeze</Button>
        </Flex>

        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Switch Mode</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can toggle between Light mode & Dark mode.</Text>
            </Box>
            <Button size={{base:"sm",md:"md"}} p={{base:"4", md:"5"}} pl={"9"} pr={"9"} colorScheme='blue' onClick={toggleColorMode}>{colorMode === "dark" ? "Light" : "Dark"}</Button>
        </Flex>

        {/* User Followers Section */}
        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <DisplayUserList title={"Your Followers"} 
        text={"See the people who followed you."}
        display={getFollowers}
        setUserstoToggle={setGetFollowers}
        loadingUsers={loadingFollowers}
        list={myFollowers}
        btntext={"Followers"}/> 

        {/* User Following section */}
        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <DisplayUserList title={"People you followed"} 
        text={"List of people whom you have followed."}
        display={getFollowing}
        setUserstoToggle={setGetFollowing}
        loadingUsers={loadingFollowing}
        list={myFollowing}
        btntext={"Following"}/>

        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} color={"red"} letterSpacing={.9} fontWeight={"bold"}>Delete Account</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can delete your account, but once deleted you will never be able to login with this account.</Text>
            </Box>
            <Button size={{base:"md",md:"md"}} p={{base:"4", md:"5"}} pl={9} pr={9} colorScheme='red' onClick={deleteAccount}>Delete</Button>
        </Flex>


    </Flex>
  )
}

export default SettingsPage;
