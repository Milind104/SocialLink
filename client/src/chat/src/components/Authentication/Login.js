import { FormControl, FormLabel, Input, VStack,InputGroup,Button,InputRightElement,useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';
const Login = () => {
    // form input
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // for password hide/unhide
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

     // on submit
     const submitHandler = async()=>{
        setLoading(true);
        if( !email || !password){
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return ;
        }
        try {
            const config = {
                headers :{
                    "Content-type" : "application/json",
                }
            }
            const {data} = await axios.post('http://localhost:4000/auth/login',{email,password},config);
                toast({
                    title: "Successfully LoggedIn",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                localStorage.setItem("userInfo",JSON.stringify(data));
                setLoading(false);
                navigate('/chats');
        } catch (error) {
            toast({
                title: "Error Ocurred",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return ;
        }
    }
  return (
    <VStack spacing={"5px"}>
        <FormControl id = 'email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
            placeholder='Enter Your Email'
            onChange={(e)=>{setEmail(e.target.value)}}></Input>
        </FormControl>
        <FormControl id = 'password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={(e)=>{setPassword(e.target.value)}}></Input>
                <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
       
        <Button
        colorScheme='blue'
        width={"100%"}
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading = {loading}
        >Log In</Button>
    </VStack>
  )
}

export default Login