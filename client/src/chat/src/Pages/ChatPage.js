import React, { useContext } from 'react'
import AppContext from '../context/AppContext'
import { Box, Button } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChats from '../components/miscellaneous/MyChats';
const ChatPage = () => {
  const {user} = useContext(AppContext);
  console.log(user);
  return (
    <div style={{width : "100%"}}>
      {user && <SideDrawer/>}
      <Box 
      display={"flex"}
      justifyContent={"space-between"}
      w={"100%"}
      h="91.5vh"
      p={"10px"}>
      {user && <MyChats/>}
      {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatPage