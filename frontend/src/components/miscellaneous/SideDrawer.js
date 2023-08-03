import {  Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text,  Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {Avatar} from '@chakra-ui/avatar'
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import ProfileModel from './ProfileModel'
import { useHistory } from 'react-router-dom'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/userListItem'
import { getSender } from '../../config/ChatLogics'
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

export default function SideDrawer() {
    const{isOpen , onOpen, onClose} = useDisclosure()
    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState()
     const {setSelectedChat , user , chats , setchats,notification, setnotification} = ChatState()
    const history = useHistory()
     const logOutHandler = ()=>{
        localStorage.removeItem("userInfo")
        history.push('/')
     }
const toast = useToast()
     const handleSearch = async()=>{
        if(!search)
        {
        toast({
        title: "please enter something in the search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
        }
        try {
            setloading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setloading(false)
            setsearchResult(data)
        } catch (error) {
             toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
        }
     }

     const accessChat = async(userId)=>{
        try {
            setloadingChat(true)
           const config = {
                headers: {
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const {data} = await axios.post('/api/chat',{userId},config)
            
            if(!chats.find((c)=> c._id === data._id))
            {
                setchats([data,...chats])
                
            }
            setSelectedChat(data)
            setloadingChat(false)
            onClose()
        } catch (error) {
           toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      }) 
        }
           
     }

  return (
    <>
    <Box 
    display='flex'
    // justifyContent='center'
    bg='white'
    w='100%'
    p='5px 10px 5px 10px'
    borderWidth='5px'
    
    
    >
        <Tooltip 
        label="Search User to Bok-Bok" 
        hasArrow 
        placement='bottom-end'
        >
         <Button variant='ghost' id='search-bar' onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass" ></i>
            <Text display={{base:"none",md:"flex"}} px={4}>Search Users</Text>
         </Button>
        </Tooltip>
        <Text fontFamily='Work sans' fontSize="2xl" >Bok-Bok</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                    />
                   <BellIcon fontSize='2xl' m={1}/>
                </MenuButton>
                <MenuList pl={2}>
                    {!notification.length && "No new Messages" }
                    {notification.map(notif =>(
                        <MenuItem key={notif._id} onClick={()=>{
                            setSelectedChat(notif.chat)
                            setnotification(notification.filter((n)=> n!== notif))
                        }}>
                          {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon/>}
                >
                 <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModel user={user}>

                    <MenuItem>My Profile</MenuItem>
                    </ProfileModel>
                    <MenuDivider/>
                    <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box> 
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay/>
       <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search for Users</DrawerHeader>
       <DrawerBody>
        <Box display='flex' pb={2}>
           <Input
           placeholder='search by email or name'
           mr={2}
           value={search}
           onChange={(e)=>{setsearch(e.target.value)}}
           >
           </Input>
           <Button onClick={handleSearch}>Go</Button>
        </Box>
        {
            loading ? (
                <ChatLoading/>
            ):(
                searchResult?.map((user)=>(
                    <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=> accessChat(user._id) }
                    />
                ))
            )
        }
        {loadingChat && <Spinner ml='auto' display='flex'/>}
       </DrawerBody>
       </DrawerContent>
    </Drawer>
    </>
  )
}
