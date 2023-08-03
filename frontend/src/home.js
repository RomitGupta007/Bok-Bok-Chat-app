import React, { useEffect } from 'react'
import { Box,  Container, Text ,TabList, Tab,TabPanels, TabPanel,Tabs } from "@chakra-ui/react"
import Login from './components/Authentication/login'
import Signup from './components/Authentication/signup'
import { useHistory } from 'react-router-dom'
export default function Home() {
  const history = useHistory()

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))

    if(user)
    {
      history.push("/chats")
    }
  })
  return (
    <Container maxW='xl' centerContent>
        <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={'white'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth='1px'
        >
          <Text fontSize='3xl' fontFamily="Work sans" paddingLeft='35%'>Bok - Bok</Text>
        </Box>
        <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
          
          <Tabs variant='soft-rounded' >
  <TabList mb='1em'>
    <Tab width='50%'>LogIn</Tab>
    <Tab width='50%'>SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <p><Login></Login></p>
    </TabPanel>
    <TabPanel>
      <p><Signup></Signup></p>
    </TabPanel>
  </TabPanels>
</Tabs>

        </Box>
    </Container>
  )
}
