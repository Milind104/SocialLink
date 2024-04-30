import React, { useContext } from 'react'
import AppContext from '../../context/AppContext'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const {selectedChat} = useContext(AppContext);
  return (
    <Box
    display={{base : selectedChat? "flex" : "none", md:"flex"}}
    alignItems={"center"}
    flexDir={"column"}
    p={3}
    // bg={"white"}
    bg={"#9FA7BF"}
    w={{base:"100%", md: "68%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}>
    <SingleChat /> 
    </Box>
  )
}

export default ChatBox