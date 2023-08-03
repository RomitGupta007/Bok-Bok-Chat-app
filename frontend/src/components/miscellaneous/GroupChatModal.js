import { FormControl, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/userListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
export default function GroupChatModal({children}) {
      const { isOpen, onOpen, onClose } = useDisclosure()
      const [groupChatName, setgroupChatName] = useState()
      const [selectedUsers, setselectedUsers] = useState([])
      const [search, setsearch] = useState("")
      const [searchResults, setsearchResults] = useState([])
      const [loading, setloading] = useState(false)
      const toast = useToast()
      const{user , chats , setchats} = ChatState()

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
                setsearchResults(data)
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
      };

      const handleSubmit = async()=>{
         if(!groupChatName || !selectedUsers)
         {
            toast({
        title: "Please fill all the fields",
       
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
         }
         try {
            const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }

        const {data} = await axios.post('/api/chat/group',{
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map(u=>u._id))
        },config)

        setchats([data,...chats])
        onClose()
        toast({
        title: "New Group Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
         } catch (error) {
            toast({
        title: "Failed to Create Chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
         }
      };
      const handleGroup = (userToAdd)=>{
         if(selectedUsers.includes(userToAdd)){
            toast({
        title: "User already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
         }

         setselectedUsers([...selectedUsers,userToAdd])
      };

      const handleDelete = (delUser)=>{
          setselectedUsers(selectedUsers.filter((sel)=> sel._id !== delUser._id));
      }

 return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
               <FormControl>
                  <Input 
                  placeholder='Group Name'
                  mb={1}
                  onChange={(e)=> setgroupChatName(e.target.value)}
                  />
               </FormControl>
               <FormControl>
                  <Input  placeholder='Add users eg:Swagata , Sagnik' mb={3}
                  onChange={(e)=> handleSearch(e.target.value)}
                  />
               </FormControl>
              {selectedUsers.map(u => (
                <UserBadgeItem key={user._id} user={u}
                handleFunction={()=> handleDelete(u)}
                />
              ))}

               {loading?<div><Spinner/></div>:(
                searchResults?.slice(0,4).map(user => (
                    <UserListItem 
                    key={user._id} 
                    user={user} 
                    handleFunction={()=> handleGroup(user)}
                    />
                ))
               )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
  
}
