import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import React from 'react'

export default function ProfileModel({user , children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
       {
        children?(<span onClick={onOpen}>{children}</span>)
        :(
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>
        )
       }
       <Modal isOpen={isOpen} onClose={onClose} size='sm' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
          fontSize='40px' 
          fontFamily='Work sans'
          display='flex'
          justifyContent='center'
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='space-between'
          
          >
            <Image
            borderRadius='md'
            boxDecorationBreak='100px'
            src={user.pic}
            alt={user.name}
            
            /><br/>
            <Text fontSize={{base:'20px',md:'23px'}} fontFamily='Work sans'>
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
