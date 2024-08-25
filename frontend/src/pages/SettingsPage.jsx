import React from 'react';
import { useState } from 'react';
import { Text, Button, Flex, Box, useColorMode} from '@chakra-ui/react';
import usePopToast from '../customHooks/usePopToast';
import useLogout from "../customHooks/useLogout";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const SettingsPage = () => {
    const [getFollowers, setGetFollowers] = useState(false);
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
        console.log("Follower function called");
        setGetFollowers((prev) => !prev);
        console.log(user);
        console.log(user.username);
        try {
            const res = await fetch(`/api/users/getfollowers/${user.username}`);
            const data = await res.json();
            console.log(data);
            if(data.error) {
              popToast("Error", data.error,"error");
              return;
            }
            
          } catch (e) {
            popToast("Error",e.message,"error");
          }

    }

  return (
    <Flex flexDirection={"column"}>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Freeze Your Account</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can unfreeze your account anytime by simply logging in.</Text>
            </Box>
            <Button size={{base:"xs",md:"sm"}} p={{base:"4", md:"5"}} colorScheme='red' onClick={freezeMyAccount}>Freeze</Button>
        </Flex>
        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Switch Mode</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can toggle between Light mode & Dark mode.</Text>
            </Box>
            <Button size={{base:"xs",md:"sm"}} p={{base:"4", md:"5"}} colorScheme='blue' onClick={toggleColorMode}>{colorMode === "dark" ? "Light" : "Dark"}</Button>
        </Flex>
        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <Flex  flexDirection={"column"} >
            <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Your Followers</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>See the people who followed you.</Text>
            </Box>
            <Button size={{base:"xs",md:"sm"}} p={{base:"4", md:"5"}} colorScheme='blue' onClick={displayFollowers}>Followers</Button>
            </Flex>
            {getFollowers && (
            <Flex flexDirection={"column"}>
            <h2>rvfesjf</h2>
            <h2>dknchesf</h2>
            <h2>kdjcnhwked</h2>
            <h2>wkejdbhwkqe</h2>
            </Flex>
        )}

        </Flex>
        <hr style={{marginTop: "14px", color:"gray", height:"10px"}}/>
        <Flex alignItems={"flex-end"} p={2} justifyContent={"space-between"} gap={4}>
            <Box>
                <Text my={1} fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>Switch Mode</Text>
                <Text my={1} mt={1} fontSize={{base:"xs",md:"sm",lg:"md"}} letterSpacing={.6}>You can toggle between Light mode & Dark mode.</Text>
            </Box>
            <Button size={{base:"xs",md:"sm"}} p={{base:"4", md:"5"}} colorScheme='blue' onClick={toggleColorMode}>{colorMode === "dark" ? "Light" : "Dark"}</Button>
        </Flex>


        
        

    </Flex>
  )
}

export default SettingsPage;
