import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import {
  Box,
  Button,
  Stack,
  Text,
  CircularProgress,
  Accordion, // Import CircularProgress for loading indicator
} from "@mui/material";
import axios from "axios";
import { Add as AddIcon } from "@mui/icons-material";
import { getSender } from "../../config/ChatLogic";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState({});
  const { Chats, selectedChat, setselectedChat, user, setChats, fetchAgain } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const fetchChats = async () => {
    setLoading(true); // Set loading state to true before making API call
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:4000/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false); // Set loading state to false after API call completes
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(data?.user); // Optional chaining to avoid errors if data.user is undefined
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bgcolor={"#9FA7BF"}
      color={"white"}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <Button
          variant="contained" // Use contained variant for primary actions
          endIcon={<AddIcon />}
          onClick={() => {
            // Handle action for creating new community
          }}
        >
          New Community
        </Button>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bgcolor={"#233855"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {loading ? ( // Display CircularProgress if loading state is true
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress color="inherit" />
          </Box>
        ) : Chats ? (
          <Stack overflow={"scroll"}>
            {Chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => {
                  setselectedChat(chat);
                }}
                cursor={"pointer"}
                bgcolor={selectedChat === chat ? "#69738E" : "#233855"}
                color={"white"}
                px={3}
                py={2}
                borderRadius={"lg"}
                _hover={{
                  bgcolor: "#69738E",
                  color: "white",
                }}
              >
                <Accordion>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Accordion>
              </Box>
            ))}
          </Stack>
        ) : (
          <Accordion color="white">No chats found.</Accordion>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
