import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ChatContext = createContext()

const ChatProvider = ({children})=>{

    const[user,setuser] = useState()
    const [SelectedChat, setSelectedChat] = useState()
    const[chats,setchats] = useState([])
    const [notification, setnotification] = useState([])
    const history = useHistory()
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)
        if(!userInfo)
        {
            history.push('/')
        }
    },[history])

    return(
        <ChatContext.Provider value={{user , setuser , SelectedChat , setSelectedChat , chats , setchats,notification, setnotification}}>
            {children}
        </ChatContext.Provider>
    )

}
export const ChatState = ()=>{

    return useContext(ChatContext)
}

export default ChatProvider;