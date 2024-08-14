import React from 'react';
import { useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
//
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import usePopToast from "../customHooks/usePopToast";
import { useParams } from "react-router-dom";
import {
    Button,
    Flex,
    FormControl,
    Textarea,
    CloseButton,
    Text,
    Image,
    FormLabel,
    Heading,
     Input,
     Stack,
     Avatar,
     Center,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import usePreviewImg from "../customHooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
//nn

const MAX_CHAR = 500;
const CreatePost = () => {
    const MAX_CHAR = 500;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const imageRef = useRef(null);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const user = useRecoilValue(userAtom);
    const popToast = usePopToast();
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    //++++

    //jh
    const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};



    const handleCreatePost = async () => {
		// sets a loading state to true indicating that the post creation process has started.
		setLoading(true);

		//fetch sends a POST request to /api/posts/create   our API endpoint for creating post.
		//The headers specify that the content type is JSON.
		//The body of the request includes postedBy, text, and img values in JSON format.
		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
			});

            //The response is converted to JSON.
			const data = await res.json();
            // console.log(data);
            //
			if (data.error) {
				popToast("Error", data.error, "error");
				return;
			}

			popToast("Success", "Post created successfully", "success");
			// If the username matches the current loggen in user,then new post is added to the posts state.
			//spread operator will do this.
			if (username === user.username) {
				setPosts([data, ...posts]);
			}
			//The post creation modal is closed, and the input fields are reset.
			onClose();
			setPostText("");
			setImgUrl("");
		} catch (error) {
			popToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};


    //


    //buyging+
  return (
    <>
      <Button
       position={"fixed"}
       bottom={10}
       right={7}
       bg={useColorModeValue("gray.300","gray.dark")}
	   size={{base: "sm", sm: "md"}}
       onClick={onOpen}>
        <AddIcon/>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Write your post here..'
								onChange={handleTextChange}
								value={postText}
							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>


    </>
  )
}

export default CreatePost
