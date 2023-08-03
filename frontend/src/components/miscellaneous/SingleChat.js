import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender,getSenderFull } from '../../config/ChatLogics'
import ProfileModel from './ProfileModel'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import axios from 'axios'
import './style.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
// import Lottie, {} from 'react-lottie'
import animationData from '../../animations/typing.json'
const ENDPOINT = "http://localhost:5000"
var socket , selectedChatCompare;

export default function SingleChat({fetchAgain , setfetchAgain}) {
 const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
  preserveAspectRatio:  "xMidYMid slice",
  },
 }
  const toast = useToast()
  const [messages , setmessages] = useState([])
  const [loading, setloading] = useState(false)
  const [newMessage, setnewMessage] = useState()
  const [socketConnected, setsocketConnected] = useState(false)
  const [typing, settyping] = useState(false)
  const [istyping, setistyping] = useState(false)
    const {user ,  SelectedChat , setSelectedChat,notification, setnotification } = ChatState()

    const fetchMessages = async()=>{
       if(!SelectedChat)
       {
        return;
       }
       try {
         const config = {
              headers:{
                Authorization: `Bearer ${user.token}`
              }
            }
            setloading(true)
            const {data} = await axios.get(`/api/message/${SelectedChat._id}`,config)
            
            setmessages(data)
            setloading(false)
            socket.emit('join chat',SelectedChat._id)
       } catch (error) {
           toast({
        title: "Error occured",
        description: "Failed to load the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      }) 
       }
    }

       useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected",()=> setsocketConnected(true))
    socket.on('typing',()=> setistyping(true))
    socket.on('stop typing',()=> setistyping(false))
   },[])

    useEffect(()=>{
      fetchMessages()

      selectedChatCompare = SelectedChat;
    },[SelectedChat])

    
    useEffect(()=>{
      socket.on("message recieved",(newMessageRecieved)=>{
         if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)
         {
           if(!notification.includes(newMessageRecieved))
           {
             setnotification([newMessageRecieved,...notification])
             setfetchAgain(!fetchAgain)
           }
         }
         else
         {
           setmessages([...messages,newMessageRecieved])
         }
      })
    })

    const sendMessage = async(event)=>{
       if(event.key==="Enter" && newMessage)
       {
        socket.emit('stop typing',SelectedChat._id)
          try {
            const config = {
              headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${user.token}`
              }
            }
            setnewMessage("");
            const {data} = await axios.post('/api/message',{
              content: newMessage,
              chatId: SelectedChat._id,
            },config)
            
            socket.emit("new message",data)
            setmessages([...messages,data])
          } catch (error) {
             toast({
        title: "Error occured",
        description: "Failed to send the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      }) 
          }
       }
    }



    const typingHandler = (e)=>{
        setnewMessage(e.target.value)

       if(!socketConnected)
       {
        return
       }
       if(!typing)
       {
        settyping(true)
        socket.emit('typing', SelectedChat._id)
       }
       let lastTypingTime = new Date().getTime()
       var timerLength = 3000;
       setTimeout(()=>{
         var timeNow = new Date().getTime()
         var timeDiff = timeNow - lastTypingTime;
         if(timeDiff >= timerLength && typing)
         {
           socket.emit('stop typing',SelectedChat._id)
           settyping(false)
         }
       },timerLength)
    }
  return (
    <>
     {
        SelectedChat ? (
          <>
          <Text
          fontSize={{base: "28px" , md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{base: "space-between"}}
          alignItems='center'
          >
            <IconButton
            display={{base:"flex" , md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=> setSelectedChat("")}
            />
            {
                !SelectedChat.isGroupChat ? (
                    <>
                    {getSender(user,SelectedChat.users)}
                    <ProfileModel user={getSenderFull(user , SelectedChat.users)}/>
                    </>
                ):(
                    <>
                    {SelectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}
                    fetchMessages={fetchMessages}
                    />
                    </>
                )
            }
          </Text>
          <Box
          display='flex'
          flexDir='column'
          justifyContent='flex-end'
          p={3}
          bg="#E8E8E8"
          w='100%'
          h='100%'
          borderRadius='lg'
          overflowY='hidden'
          >
           {
            loading ? (
              <Spinner
              size='xl'
              w={20}
              h={20}
              alignSelf='center'
              margin='auto'
              />
            ):(
             <div className='messages'>
                <ScrollableChat messages={messages}/>
             </div>
            )
           }
           <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                 {istyping?<div>
                 Typing....
                 </div>:<></>}
                 <Input 
                 variant='filled'
                 bg='#E0E0E0'
                 placeholder='Enter a message...'
                 onChange={typingHandler}
                 value={newMessage}
                 />
           </FormControl>
          </Box>
          </>
        ) : (
            <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
             <Text fontSize='3xl' fontFamily='Work sans'>
                Click on a user to start chatting
             </Text>
            </Box>
        )
     }
    </>
  )
}
