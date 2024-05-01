import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Box, Button } from "@mui/material"; // Importing from Material-UI
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import Navbar from "scenes/navbar";

const ChatPage = () => {
  const { user } = useContext(AppContext);
  console.log(user);

  return (
    <>
      {/* <Navbar /> */}
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        {/* <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          height="91.5vh"
          padding={"10px"}
        >
          {user && <MyChats />}
          {user && <ChatBox />}
        </Box> */}
      </div>
    </>
  );
};

export default ChatPage;
