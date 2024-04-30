import React, { useEffect } from "react";
import { Box, Container, Text,Tab,TabList,TabPanel,TabPanels,Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Singup from "../components/Authentication/Singup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) navigate("/chats");
  },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        // bg={"white"}
        bg={"#9FA7BF"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" color={"black"}>
          {" "}
          SkillXchg{" "}
        </Text>
      </Box>
      <Box
        bg={"white"}
        // bg={"#9FA7BF"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
                <Login/>
            </TabPanel>
            <TabPanel>
                <Singup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
