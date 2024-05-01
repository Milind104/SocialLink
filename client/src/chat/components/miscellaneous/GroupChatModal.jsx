import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, Chats, setChats } = useContext(AppContext);

  const handleSearch = async (search) => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/auth?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const users = JSON.stringify(selectedUsers.map((u) => u._id));
      const { data } = await axios.post(
        `http://localhost:3001/chat/group`,
        { name: groupChatName, users },
        config
      );
      setChats([data, ...Chats]);
      onClose();
      toast({
        title: "Successfully Created Group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // add and remove before making the group
  const handleDelete = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToRemove._id)
    );
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSelectedUsers([userToAdd, ...selectedUsers]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Community
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers?.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>
            {/* render searched users */}
            {loading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            {/* create group chat */}
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
