import { Avatar, Flex, Text, Box, Image, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedChatAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, msg }) => {
  const selectedChat = useRecoilValue(selectedChatAtom);
  const currentUser = useRecoilValue(userAtom);
  const [imgReadyToUpload, setImageReadyToUpload] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {/* <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"} >
        {msg.text}
      </Text> */}
          {msg.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{msg.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={msg.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          {/* When image is not loaded and processing to be ready to show in the chat show skeleton instead*/}
          {msg.img  && !imgReadyToUpload && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={
                  msg.img
                }
                alt="Message image"
                borderRadius={4}
                hidden onLoad={() => {setImageReadyToUpload(true)}}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {/* When image is loaded and ready to show in the chat to auto scroll till bottom and not show skeleton*/}
          {msg.img  && imgReadyToUpload && (
            <Flex mt={5} w={"200px"}>
              <Image src={msg.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={msg.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}


          <Avatar src={currentUser.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedChat.userProfilePic} w={7} h={7} />

          {
            msg.text && (
            <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            borderRadius={"md"}
            color={"black"}
            >
            {msg.text}
            </Text>
            )
          }

          
          {/* When image is not loaded and processing to be ready to show in the chat show skeleton instead*/}
          {msg.img  && !imgReadyToUpload && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={
                  msg.img
                }
                alt="Message image"
                borderRadius={4}
                hidden onLoad={() => {setImageReadyToUpload(true)}}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {/* When image is loaded and ready to show in the chat to auto scroll till bottom and not show skeleton*/}
          {msg.img  && imgReadyToUpload && (
            <Flex mt={5} w={"200px"}>
              <Image src={msg.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
          
        </Flex>
      )}
    </>
  );
};

export default Message;
