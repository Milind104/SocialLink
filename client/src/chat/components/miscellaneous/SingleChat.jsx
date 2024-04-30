import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Typography,
  useToast,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AppContext from "../../../context/AppContext";
import { getProfile, getSender } from "../../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { encryptWithAES } from "../../config/Secure";

const END_POINT = "http://localhost:4000";
let socket;
let selectedChatCompare;

const SingleChat = () => {
  const { user, selectedChat, setselectedChat } = useContext(AppContext);
  const [Messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  //   const toast = useToast();

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      //  toast({
      //    title: "Error Occurred",
      //    status: "warning",
      //    duration: 5000,
      //    isClosable: true,
      //    position: "bottom",
      //  });
    }
    setLoading(false);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:4000/message",
          {
            content: encryptWithAES(newMessage),
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...Messages, data]);
      } catch (error) {
        //    toast({
        //      title: "Error Occurred",
        //      status: "warning",
        //      duration: 5000,
        //      isClosable: true,
        //      position: "bottom",
        //    });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // notification
      } else {
        setMessages([...Messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            variant="h5"
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <IconButton
              sx={{ display: "flex", md: "none" }}
              onClick={() => {
                setselectedChat("");
              }}
            >
              <ArrowBack />
            </IconButton>
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal />
              </>
            ) : (
              <>
                {getSender(user.user, selectedChat.users)}
                <ProfileModal
                  user={getProfile(user.user, selectedChat.users)}
                />
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              bgcolor: "#E8E8E8",
              width: "100%",
              borderRadius: "lg",
              overflowY: "hidden",
            }}
          >
            {/* messages */}
            {loading ? (
              <CircularProgress color="success" />
            ) : (
              <>
                <Box
                  className="messages"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                  }}
                >
                  <ScrollableChat messages={Messages} />
                </Box>
              </>
            )}
            {/* input message */}
            <FormControl onKeyDown={sendMessage} required mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message ..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h4" pb={3}>
            Click on a user to start chating
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
