import { Box,Button,Menu,Text,Tooltip,MenuButton, Avatar, MenuItem, MenuList, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import AppContext from '../../context/AppContext';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
const SideDrawer = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {user,setselectedChat,Chats,setChats} = useContext(AppContext);
    const [search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const navigate = useNavigate();
    const toast = useToast();
    const logoutHandler = ()=>{
        localStorage.removeItem("userInfo");
        navigate("/");
    }
    const handleSearch = async()=>{
        if(!search){
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
            const config ={
                headers :{
                    Authorization : `Bearer ${user.token}`
                },
            }
            const {data} = await axios.get(`http://localhost:4000/auth?search=${search}`,config);
            // console.log(data);
            setLoading(false);
            setsearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    const accessChat = async(userId)=>{
        console.log("access chat .....",userId);
        try {
            setLoadingChat(true);
            const config ={
                headers :{
                    "Content-type" : "application/json",
                    Authorization : `Bearer ${user.token}`
                },
            }
            const {data} = await axios.post("http://localhost:4000/chat",{userId},config);

            console.log("---------------",data);
            // if already present
            if(!Chats.find((c)=>(c._id === data._id))){
                console.log("hello new Chat added");
                setChats([data,...Chats]);
            }
            setselectedChat(data);
            setLoadingChat(false);
            onClose();
            return;
        } catch (error) {
            toast({
                title: "Error Finding Chats",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems={"center"}
    // bg={"white"}
    bg={"#23355"}
    w={"100%"}
    p={"5px 10px 5px 10px"}
    borderWidth={"5px"}>
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick={onOpen}>
                <i class="fas fa-search"></i>
                <Text display={{base:"none",md:"flex"}} px={"4px"}>Search User</Text>
            </Button>
        </Tooltip>
        <Text fontSize={"2xl"}>
            SkillXchg
        </Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize="2xl"></BellIcon>
                </MenuButton>
                {/* <MenuList></MenuList> */}
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user.user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen} bg="black">
        <DrawerOverlay/>
        <DrawerContent bg={"#233855"} color={"white"}> 
            <DrawerHeader borderBottomWidth={"1px"}>search User</DrawerHeader>
        <DrawerBody>
            <Box display="flex"  pb={2}>
                <Input 
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e)=>{setsearch(e.target.value)}}/>
                <Button onClick={handleSearch}>Go</Button>
            </Box>
            {Loading? (
                <ChatLoading/>
            ): (
                searchResult?.map((user)=>{
                    return <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}/>
                })
                // results
            )} 
            {loadingChat && <Spinner ml="auto" d="flex"/>}
        </DrawerBody>
        </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideDrawer