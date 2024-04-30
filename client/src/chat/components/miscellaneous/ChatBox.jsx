import React, { useContext } from "react";
import { Box } from "@mui/material";
import AppContext from "../../../context/AppContext";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = useContext(AppContext);

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        padding: 3,
        bgcolor: "#9FA7BF",
        width: { xs: "100%", md: "68%" },
        borderRadius: "lg",
        borderWidth: "1px",
      }}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
