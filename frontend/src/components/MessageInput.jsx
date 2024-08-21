import React, {useState}from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';
import usePopToast from '../customHooks/usePopToast';
import { selectedChatAtom } from '../atoms/messagesAtom';
import { conversationsAtom } from '../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const MessageInput = ({setMessages, messages}) => {

  const [messageText, setMessageText] = useState("");
  const popToast = usePopToast();
  const selectedChat = useRecoilValue(selectedChatAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!messageText) {
      return;
    }
    console.log(messageText);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          message : messageText,
          recipientId : selectedChat.userId,
        }),
      })

      const data = await res.json();
      if(data.error) {
        popToast("Error", data.error, "error");
        return;
      }
      console.log("chat msg data",data);

      //???? adding one more message object inside conversation for that selected user.
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

      setMessageText("")
      console.log("messages",messages);
    } catch (error) {
      popToast("Error", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} >
       
      <InputGroup mb={3}>
      <Input w={"full"}  placeholder='Type a message' onChange={(e) => setMessageText(e.target.value)} value={messageText}/>
      <InputRightElement cursor={"pointer"} onClick={handleSubmit}>
        <IoSendSharp /> 
      </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default MessageInput
