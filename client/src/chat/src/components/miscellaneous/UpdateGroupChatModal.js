import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppContext'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';

const UpdateGroupChatModal = () => {
    const {user, selectedChat, setselectedChat,fetchAgain,setfetchAgain} = useContext(AppContext);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setgroupChatName] = useState();
    const [search, setsearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setrenameLoading] = useState(false);

    const toast = useToast();
    const handleRemove = ()=>{}
    const handleSearch = ()=>{}
    const handleRename = async()=>{
        if(!groupChatName)return;
        try {
            setrenameLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put('http://localhost:4000/chat/rename',{
                chatId : selectedChat._id,
                chatName : groupChatName
            },config);
            console.log("hello from the inside",data);
            setselectedChat(data);
            setfetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
        setrenameLoading(false);
        setgroupChatName("");
    }
  return (
    <>
    <IconButton display= {{base : "flex"}}  icon={<ViewIcon/>}onClick={onOpen}/>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={"35px"}
          display={"flex"}
          justifyContent={"center"}>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}>
            <Box 
            w={"100%"}
            display={"flex"}
            flexWrap={"wrap"}>
                {selectedChat?.users.map((u)=>{
                    return <UserBadgeItem key={user._id} user={u} handleFunction={()=>handleRemove(u)}/>
                })}
                </Box>
                <FormControl display={"flex"}>
                <Input  placeholder='Chat Name' mb={3} onChange={(e)=>{setgroupChatName(e.target.value)}}/>
                <Button
                variant={"solid"}
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}>Update</Button>
            </FormControl>
            <FormControl>
                <Input  placeholder='Add Users' mb={3} onChange={(e)=>{handleSearch(e.target.value)}}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=>{handleRemove(user)}}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default UpdateGroupChatModal