import React, {useEffect, useState} from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, useColorModeValue, Button, Text, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import usePopToast from "../customHooks/usePopToast";
import {conversationsAtom} from '../atoms/messagesAtom';
import { useRecoilState, useRecoilValue} from "recoil";
import {selectedChatAtom} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  //
  const [loadConversations, setLoadConversations] = useState(true);
  const [searchUserText, setSearchUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const loggedInUser = useRecoilValue(userAtom);
  const popToast = usePopToast();
  const {socket, onlineUsers} = useSocket();


  useEffect(() => {
    socket?.on("messagesSeen", ({conversationId}) => {
      setConversations(prev => {
        const updated = prev.map(conversation => {
          if(conversation._id === conversationId){
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen : true,
              },
            };
          }
          return conversation;
        });
        return updated;
      })
    })
  },[socket, setConversations]);

  useEffect(() => {

    const getConversations = async () => {
      setLoadConversations(true);
      try {
        const res = await fetch("/api/messages/conversations");
        const data  = await res.json();
        if(data.error) {
          popToast("Error", data.error, "error");
          return; 
        }
        console.log(data);
        setConversations(data);

      } catch (error) {
        popToast("Error", error.message, "error");
      } finally {
        setLoadConversations(false); //
      }
    };
    getConversations();
    },[popToast, setConversations])



    //Searing users to send messages to them.
    const searchUser = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log(searchUserText);
      try {
        const res = await fetch(`/api/users/getprofile/${searchUserText}`);
        const foundUser = await res.json();

        if(foundUser.error) {
          popToast("Error", data.error, "error");
          return; 
        }
        console.log(foundUser);
        //We are searching ourselves.
        if(foundUser._id === loggedInUser._id){
          popToast("Error","Cannot send messages to yourself", "error");
          return;
        }

        //User exist already in our chat history.
        if(conversations.find(conv => conv.participants[0]._id === foundUser._id)){
          setSelectedChat({
            _id : conversations.find(conv => conv.participants[0]._id === foundUser._id)._id,
            userId : foundUser._id,
            username : foundUser.username,
            userProfilePic : foundUser.profilePic, 
          })
          return;
        }

        //if user doesn't exist in our chat panel
        const newConversation = {
          new : true,
          lastMessage : {
            text: "",
            sender: "",
          },
          _id : Date.now(),
          participants : [
            {
              _id : foundUser._id,
              username : foundUser.username,
              profilePic : foundUser.profilePic
            }
          ]
        }

        setConversations((prev) => [...prev, newConversation]);

      } catch (error) {
        popToast("Error", error.message, "error");
      } finally{
        setLoading(false); //
      }
    }

    return (
    <Box position={"absolute"} left={"50%"} transform={"translateX(-50%)"} p={4} w={{base: "100%", md: "80%", lg: "750px"}} >
      
      <Flex gap={4} flexDirection={{base: "column", md: "row"}} maxW={{sm: "400px", md: "full"}} mx={"auto"}>
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{sm : "250px", md: "full"}} mx={"auto"}>
            <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>Your Conversations</Text>
            <form action="" onSubmit={searchUser}>
                <Flex alignItems={"center"} gap={2}>
                    <Input placeholder='Search user' onChange={(e) => setSearchUserText(e.target.value)}/>
                    <Button size={"md"} onClick={searchUser} isLoading={loading}>
                        <SearchIcon />
                    </Button>
                </Flex>
            </form>

            {loadConversations && 
            [0,1,2,3,4].map((_, i) => (
                <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                    <Box>
                        <SkeletonCircle size={"10"}/>
                    </Box>
                    <Flex w={"full"} flexDirection={"column"} gap={3}>
                        <Skeleton h={"10px"} w={"80px"}/>
                        <Skeleton h={"8px"} w={"90%"}/>
                    </Flex>
                </Flex>
            ))}

            {!loadConversations && 
             conversations.map((conversation) => (
                <Conversation key={conversation._id} conversation={conversation} 
                isOnline={onlineUsers.includes(conversation.participants[0]._id)} />          
            ))}
            
            
        </Flex>
        {!selectedChat._id && (
          <Flex flex={70} borderRadius={"md"} p={2} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
          <GiConversation size={70}/>
          <Text>Select a Conversation to start messaging</Text>
        </Flex>
        )}
        {selectedChat._id && <MessageContainer/>}
        
        {/* <Flex flex={70}>Message container</Flex> */}
      </Flex>
    </Box>
  )
}

export default ChatPage
