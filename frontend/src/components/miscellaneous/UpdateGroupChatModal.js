import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/chatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/userListItem'
export default function UpdateGroupChatModal({fetchAgain , setfetchAgain , fetchMessages}) {
  
    const { isOpen , onOpen , onClose} = useDisclosure()
    const{user ,  SelectedChat , setSelectedChat} = ChatState()
    const[groupChatName , setgroupChatName] = useState()
    const [search , setsearch] = useState()
    const [searchResult , setsearchResult] = useState([])
    const [loading , setloading] = useState(false)
    const [renameloading , setrenameloading] = useState(false)
    const toast = useToast()

    const handleRemove = async(user1)=>{
          if(SelectedChat.groupAdmin._id != user._id && user._id != user1._id)
          {
             toast({
        title: "Only Admin can remove Someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
          }
        
                    try {
            setloading(true)

             const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/groupremove',{
                chatId: SelectedChat._id,
                userId: user1._id
            },config)

            user1._id === user._id ? setSelectedChat():setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            fetchMessages()
            setloading(false)
          } catch (error) {
            toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false)
          }
          

    }

    const handleRename = async()=>{
        if(!groupChatName)
        {
            return
        }
        try {
            setrenameloading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/rename',{
                chatId: SelectedChat._id,
                chatName: groupChatName
            },config)

            setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            setrenameloading(false)
        } catch (error) {
            toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
      setrenameloading(false)
        }
        setgroupChatName("")
    }

    const handleSearch = async(query)=>{
        setsearch(query)
        if(query)
        {
            try {
                setloading(true)
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }
                const {data} = await axios.get(`/api/user?search=${search}`, config)
                setloading(false)
                setsearchResult(data)
            } catch (error) {
                toast({
        title: "Error Occured!",
        description: "Failed to Load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
            }
        }
    }

    const handleAddUser = async(user1)=>{
          if(SelectedChat.users.find((e)=> e._id === user1._id))
          {
            toast({
        title: "Error Occured!",
        description: "User already in the droup",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
          }

          if(SelectedChat.groupAdmin._id != user._id)
          {
             toast({
        title: "Only Admin can Add Someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
          }

          try {
            setloading(true)

             const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/groupadd',{
                chatId: SelectedChat._id,
                userId: user1._id
            },config)

            setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            setloading(false)
          } catch (error) {
            toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false)
          }
    }
    return (
     <>
      <IconButton display={{ base: 'flex'}} icon={<ViewIcon/>} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='35px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center'
          >{SelectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
                {
                    SelectedChat.users.map(u => (
                         <UserBadgeItem key={user._id} user={u}
                handleFunction={()=> handleRemove(u)}
                />
                    ))
                }
            </Box>
            <FormControl display='flex'>
                <Input
                placeholder='Chat Name'
                mb={3}
                // value={groupChatName}
                onChange={(e)=>{setgroupChatName(e.target.value)}}
                />
                <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input
                placeholder='Add users to this Group'
                mb={1}
                
                onChange={(e)=> handleSearch(e.target.value)}
                />
            </FormControl>
            {
                loading?(
                  <Spinner size='lg'/>
                ):(
                  searchResult?.map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=> handleAddUser(user)}
                    />
                  ))
                )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>{handleRemove(user)}}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
