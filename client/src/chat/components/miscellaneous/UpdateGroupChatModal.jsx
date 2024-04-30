import React, { useContext, useState } from "react";
import AppContext from "../../../context/AppContext";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  DialogContent,
  ModalHeader,
  ModalFooter,
  Typography,
  DialogActions,
  useDisclosure,
  useToast,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";

const UpdateGroupChatModal = () => {
  const { user, selectedChat, setselectedChat, fetchAgain, setfetchAgain } =
    useContext(AppContext);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  // const toast = useToast();

  const handleRemove = () => {
    // Handle removal logic
  };

  const handleSearch = () => {
    // Handle search logic
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:4000/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setselectedChat(data);
      setfetchAgain(!fetchAgain);
    } catch (error) {
      // toast({
      //   title: "Error Occurred",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    }

    setRenameLoading(false);
    setGroupChatName("");
  };

  return (
    <>
      <IconButton sx={{ display: "flex" }} onClick={handleOpen}>
        <Visibility />
      </IconButton>
      <Modal open={handleOpen} onClose={handleClose} center>
        <Box
          sx={{
            width: "300px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {selectedChat.chatName}
          </Typography>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
              {selectedChat?.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                );
              })}
            </Box>
            <FormControl sx={{ display: "flex" }}>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
                disabled={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl sx={{ display: "flex" }}>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleRemove(user);
              }}
            >
              Leave Group
            </Button>
          </DialogActions>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
