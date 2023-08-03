import { Box } from "@chakra-ui/react"
import { ChatState } from "./context/chatProvider"
import SideDrawer from "./components/miscellaneous/SideDrawer"
import MyChats from "./components/miscellaneous/MyChats"
import ChatBox from "./components/miscellaneous/ChatBox"
import { useState } from "react"

export default function Chat() {
  const {user} = ChatState()
  const [fetchAgain, setfetchAgain] = useState(false)
  return (
    <div style={{width: "100%"}}>
        {user && <SideDrawer/>}
        <Box
        display='flex'
         justifyContent="space-between"
         w="100%"
         h="91.5vh"
         p="10px"
        >
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
        </Box>
    </div>
  )
}
