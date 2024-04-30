import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Box, Button } from "@mui/material"; // Importing from Material-UI
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";

const ChatPage = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"} // Changed w to width
        height="91.5vh" // Changed h to height
        padding={"10px"} // Changed p to padding
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
