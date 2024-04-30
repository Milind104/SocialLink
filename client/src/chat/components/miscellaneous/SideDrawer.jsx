import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Menu,
  MenuItem,
  Avatar,
  MenuList,
  MenuDivider,
  Tooltip,
  Typography,
  CircularProgress,
  Accordion,
} from "@mui/material";
import { Abc, Bell, ChevronDown } from "@mui/icons-material";
import axios from "axios";
import AppContext from "../../../context/AppContext";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { user, setselectedChat, Chats, setChats } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      // Handle empty search
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/auth?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      // Handle error
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/chat",
        { userId },
        config
      );

      if (!Chats.find((c) => c._id === data._id)) {
        setChats([data, ...Chats]);
      }
      setselectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#23355"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip title="Search Users to Chat" arrow placement="bottom-end">
          <Button variant="text" onClick={() => setIsOpen(true)}>
            <i className="fas fa-search"></i>
            <Typography display={{ base: "none", md: "flex" }} px="4px">
              Search User
            </Typography>
          </Button>
        </Tooltip>
        <Typography fontSize="2xl">Social Link</Typography>
        <div>
          <Menu>
            <MenuItem>
              <Abc fontSize="large" />
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem>
              <Avatar src={user.pic} alt={user.name} />
            </MenuItem>
            <MenuList>
              <ProfileModal user={user.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              {/* <MenuDivider /> */}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        anchor="left"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        variant="temporary"
      >
        {/* <DrawerOverlay /> */}
        <Accordion bgcolor="#233855" color="white">
          <Accordion borderBottomWidth="1px">Search User</Accordion>
          <Accordion>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <CircularProgress size={24} />}
          </Accordion>
        </Accordion>
      </Drawer>
    </>
  );
};

export default SideDrawer;
