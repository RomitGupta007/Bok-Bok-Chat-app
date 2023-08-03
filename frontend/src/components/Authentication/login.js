import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast } from '@chakra-ui/react'
export default function Login() {
     var[show,setshow] = useState(false)
     var[loading,setloading] = useState(false)
    var[email,setemail] = useState()
    var[password,setpassword] = useState()
    const toast = useToast()
      const history = useHistory();
 
    const submitHandler = async()=>{
        setloading(true)
        if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
       toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }

           

    }
  return (
    <VStack spacing='5px'>

       <FormControl>
        <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' value={email} onChange={(e)=>setemail(e.target.value)}></Input>
       </FormControl>
       <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={show?'text':'password'} placeholder='Enter Your Password' value={password} onChange={(e)=>setpassword(e.target.value)}></Input>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=>{setshow(!show)}}>{show?'Hide':'Show'}</Button>
            </InputRightElement>
        </InputGroup>
       </FormControl>

       <Button 
       colorScheme='blue'
       width="100%"
       style={{marginTop:15}}
       onClick={submitHandler}
       >
        Log In
       </Button>

       <Button 
       variant='solid'
       colorScheme='red'
       width="100%"
       style={{marginTop:15}}
       onClick={()=>{
        setemail('guest123@gmail.com')
        setpassword('12345')
       }}
       >
        Get Guest Credentials
       </Button>
    </VStack>
  )
}
