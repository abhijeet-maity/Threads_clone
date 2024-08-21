import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState, useRef} from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import usePopToast from '../customHooks/usePopToast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedChatAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';


const MessageContainer = () => {
  
  const chatContainerRef = useRef(null);
  const popToast = usePopToast();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const loggedInUser = useRecoilValue(userAtom);
  const {socket} = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);


  useEffect(() => {
    socket.on("newMessage", (message) => {

      if(selectedChat._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if(conv._id === message.conversationId){
            return {
              ...conv,
              lastMessage: {
                text : message.text,
                sender: message.sender,
              }
            }
          }
          return conv;
        })
        return updated;
      })


    })

    return () => socket.off("newMessage");
  },[socket, selectedChat, setConversations]);  //SelectedChat, setConversations.

  useEffect(() => {
    const lastMsgFromOther = messages.length && messages[messages.length - 1].sender !== loggedInUser._id;
    if(lastMsgFromOther) {
      socket.emit("markMsgSeen", {
        conversationId: selectedChat._id,
        userId : selectedChat.userId,
      });
    };

    socket.on("messagesSeen", ({conversationId}) => {
      if(selectedChat._id === conversationId){
        setMessages(prev => {
          const updated = prev.map(msg => {
            if(!msg.seen){
              return {
                ...msg,
                seen: true,
              };
            }
            return msg;
          })
          return updated;
        })
      }
    })

  },[socket, loggedInUser._id, messages, selectedChat]);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [messages]);

  useEffect(() => {

    const getChats = async () => {
      setLoading(true);
      setMessages([]);
      try {
        if(selectedChat.new) return;
        const res = await fetch(`/api/messages/${selectedChat.userId}`)
        const data = await res.json();
        if (data.error) {
          popToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setMessages(data);
      } catch (error) {
        popToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    getChats();
  },[popToast, selectedChat.userId, selectedChat.new]); //selectedChat.new.


  return (
    <Flex flex="70" 
    bg={useColorModeValue("gray.200", "gray.dark")}
    borderRadius={"md"}
    flexDirection={"column"}
    px={2}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedChat.userProfilePic} size={"sm"}/>
        <Text display={"flex"} alignItems={"center"} >
            {selectedChat.username} <Image src='/verified.png' w={4} h={4} ml={1}/>
        </Text>
      </Flex>
      <Divider/>
      <Flex flexDirection={"column"} gap={4} my={2} p={3} height={"440px"} overflowY={"auto"}>
        {loading  && (
            [...Array(5)].map((_, i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={2} borderRadius={"md"} alignSelf={ i%2 === 0 ? "flex-start" : "flex-end" }>

                    {i % 2 === 0 && <SkeletonCircle size={8} />}
                    <Flex flexDirection={"column"} gap={2}>
                        <Skeleton h="8px" w="250px" />
                        <Skeleton h="8px" w="250px"/>
                        <Skeleton h="8px" w="250px"/>
                    </Flex>
                    {i % 2 !== 0 && <SkeletonCircle size={8} />}

                </Flex>
            ))
        )}

        {!loading && (
          messages.map((msg) => (
            <Flex key={msg._id}
              direction={"column"}
              ref={messages.length - 1 === messages.indexOf(msg) ? chatContainerRef : null}
              >
            <Message  msg={msg} ownMessage={loggedInUser._id === msg.sender}/>
            </Flex>
          ))
        )}
        
        
      </Flex>
      <MessageInput setMessages={setMessages} messages={messages}/>
    </Flex>
  )
}

export default MessageContainer
