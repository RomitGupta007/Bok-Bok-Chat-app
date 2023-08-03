import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
export default function Signup() {
     const toast = useToast()
     const history = useHistory()
    var[show,setshow] = useState(false)
    var[name,setname] = useState()
    var[email,setemail] = useState()
    var[password,setpassword] = useState()
    var[confirmpassword,setconfirmpassword] = useState()
    var[pic,setpic] = useState()
    var[loading,setloading] = useState(false)
    const postdetails = (pic)=>{
        setloading(true)
        if(pic === undefined)
        {
            toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        })
        return;
        }
        if(pic.type === 'image/jpeg' || pic.type === 'image/png')
        {
            const data = new FormData();
           
            data.append('file',pic)
            data.append('upload_preset','Bok-Bok')
            data.append('cloud_name','dagukzy9p')
            fetch("https://api.cloudinary.com/v1_1/dagukzy9p/image/upload",{
                method:"post",
                body: data,
            }).then((res)=>res.json())
            .then((data)=>{
                console.log(data.url.toString());
                setpic(data.url.toString());
                console.log(pic);
                setloading(false)
            })
            .catch((err)=>{
                console.log(err);
                setloading(false) 
            })

        }
        else
        {
             toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });
        setloading(false)
        }
    }

    const submitHandler = async()=>{
        setloading(true)
        if(!name || !password || !email || !confirmpassword)
        {
            toast({
          title: 'Fill All the Fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });
        setloading(false)
        return;
        }
        if(password !== confirmpassword)
        {
            toast({
          title: "Passwords doesn't match",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });
        return;
        }

        try {
            
           const config = {
            headers: {
                "content-type":"application/json"
            }
           }

           const {data} = await axios.post("/api/user",{name,email,password,pic},config)
           toast({
          title: "Registration Successful!",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });

        localStorage.setItem("userInfo",JSON.stringify(data)) 
        setloading(false)
        history.push('/chats')

        } catch (error) {
            
             toast({
          title: "Error Occured",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });
        setloading(false)

        }
    }
  return (
    <VStack spacing='5px'>
       <FormControl>
        <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e)=>setname(e.target.value)}></Input>
       </FormControl>
       <FormControl>
        <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' onChange={(e)=>setemail(e.target.value)}></Input>
       </FormControl>
       <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={show?'text':'password'} placeholder='Enter Your Password' onChange={(e)=>setpassword(e.target.value)}></Input>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=>{setshow(!show)}}>{show?'Hide':'Show'}</Button>
            </InputRightElement>
        </InputGroup>
       </FormControl>

       <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input type={show?'text':'password'} placeholder='Confirm Your Password' onChange={(e)=>setconfirmpassword(e.target.value)}></Input>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=>{setshow(!show)}}>{show?'Hide':'Show'}</Button>
            </InputRightElement>
        </InputGroup>
       </FormControl>

       <FormControl>
        <FormLabel>Upload Picture</FormLabel>
        <Input type='file' p={1.5} accept='image/*' onChange={(e)=> postdetails(e.target.files[0])}></Input>
       </FormControl>

       <Button 
       colorScheme='blue'
       width="100%"
       style={{marginTop:15}}
       onClick={submitHandler}
       isLoading={loading}
       >Sign Up</Button>
    </VStack>
  )
}
