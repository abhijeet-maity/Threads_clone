import React, {useState, useRef}from 'react';
import { Flex, Input, InputGroup, InputRightElement, Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
  Image,
	useDisclosure, } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';
import usePopToast from '../customHooks/usePopToast';
import { selectedChatAtom } from '../atoms/messagesAtom';
import { conversationsAtom } from '../atoms/messagesAtom';
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import usePreviewImg from "../customHooks/usePreviewImg";

const MessageInput = ({setMessages, messages}) => {

  const [messageText, setMessageText] = useState("");
  const [isSendingData, setIsSendingData] = useState(false);
  const popToast = usePopToast();
  const selectedChat = useRecoilValue(selectedChatAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const {onClose} = useDisclosure(); //To close the modal after clicking.
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //If no message is typed or image is selected then get out of the function.
    if(!messageText && !imgUrl) {
      return;
    }
    //If user tries to send multiple data at the same time.
    if(isSendingData) {
      return;
    }
    setIsSendingData(true);

    console.log(messageText);

    try {
      //POST request to /api/messages/ api endpoint to save the message in the database.
      const res = await fetch("/api/messages", {
        method: "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          message : messageText,
          recipientId : selectedChat.userId,
          img : imgUrl,
        }),
      })

      const data = await res.json();
      if(data.error) {
        popToast("Error", data.error, "error");
        return;
      }
      console.log("chat msg data",data);

      //???? adding one more message object inside conversation array for that selected user.
      setMessages((messages) => [...messages, data]);

      //????? To update the last message to show it on the chat selection panel.
      setConversations(prev => {
        const updatedOne = prev.map(conv => {
          if(conv._id === selectedChat._id) {
            return {
              ...conv,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conv;
      })
      return updatedOne;
    }),

      setMessageText("");
      setImgUrl("");
      console.log("messages",messages);
    } catch (error) {
      popToast("Error", error.message, "error");
    } finally{
      setIsSendingData(false); // message or image is been sent to the user.
    }
  };

  // const handleImageChange = () => {

  // }

  return (
    <Flex gap={2} alignItems={"center"} >
      <form onSubmit={handleSubmit} style={{flex: 95}}>
       <InputGroup mb={3}>
       <Input w={"full"}  placeholder='Type a message' onChange={(e) => setMessageText(e.target.value)} value={messageText}/>
       <InputRightElement cursor={"pointer"} onClick={handleSubmit}>
         <IoSendSharp /> 
       </InputRightElement>
       </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"} mb={4} justifyContent={"center"} alignItems={"center"}>
				<BsFillImageFill size={35} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}   
				onClose={() => {
					onClose();
					setImgUrl("");
				}} 
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSendingData ? (
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSubmit}/>
              ) : (
                <Spinner size={"md"}/>
              )}	
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>
    
  )
}

export default MessageInput
