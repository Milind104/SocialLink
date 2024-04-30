import React, { useContext } from "react";
import AppContext from "../../../context/AppContext";
import { Avatar, Tooltip } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import { decryptWithAES } from "../../config/Secure";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(AppContext);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user.user._id) ||
              isLastMessage(messages, i, user.user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom-start">
                <Avatar
                  sx={{ mt: "7px", mr: 1, cursor: "pointer" }}
                  size="small"
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user.user._id ? "#BEE3F8" : "#B9F5D0",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                marginTop: isSameUser(messages, m, i, user.user._id) ? 3 : 10,
              }}
            >
              {decryptWithAES(m.content)}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
