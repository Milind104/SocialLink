import { FormControl, FormLabel, Input, VStack,InputGroup,Button,InputRightElement, useToast, position } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const Singup = () => {
   
    // navigate 
    const navigate = useNavigate(); 
    // form input
    const [name, setname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setpic] = useState();

    // loading 
    const toast = useToast();
    const [loading, setLoading] = useState();
    // for password hide/unhide
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    // image
    const postDetails = (pics) =>{
        // setLoading(true);
        console.log(pics.type);
        if(pics === undefined){
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return ;
        }

        if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_present", "chat-app");
            data.append("cloud_name","dsxrs42sx");
            fetch("https://api.cloudinary.com/v1_1/dsxrs42sx/image/upload",{
                method: "post",
                body: data,
            }).then((res)=>{
                res.json()
            }).then((data)=>{
                setpic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }
        else{
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return ;
        }
    }
    // on submit
    const submitHandler = async()=>{
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
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
        if(password !== confirmpassword){
            toast({
                title: "Password Do Not Match",
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
            const {data} = await axios.post('http://localhost:4000/auth/signup',{name,email,password,pic},config);
                toast({
                    title: "Registration Successfull",
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
        <FormControl id = 'first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
            placeholder='Enter Your Name'
            onChange={(e)=>{setname(e.target.value)}}></Input>
        </FormControl>
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
        <FormControl id = 'confirmpassword' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={(e)=>{setConfirmpassword(e.target.value)}}></Input>
                <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id = 'pic'>
            <FormLabel>Upload your Picture</FormLabel>
            <Input 
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e)=>{postDetails(e.target.value[0])}}></Input>
        </FormControl>
        <Button
        colorScheme='blue'
        width={"100%"}
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
        >Sign Up</Button>
    </VStack>
  )
}

export default Singup