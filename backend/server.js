var express = require("express")
var {chats} = require('./data/data')
var dotenv = require('dotenv')
var cors = require('cors')
var colors = require('colors')
const connectDB = require("./config/db")
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const path = require('path')
dotenv.config();
connectDB();
var app = express()
app.get('/',(req,res)=>{
   res.send("It's Romit")
})
app.use(cors())
app.use(express.json())
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

//----------deploy-----------
// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV === 'production')
// {
//    app.use(express.static(path.join(__dirname1,'/frontend/build')))
//    app.get('*',(req,res)=>{
//       res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'))
//    })
// }
// else
// {
//    app.get('/',(req,res)=>{
//        res.send("API is running Successfully")
//    })
// }
//----------deploy-----------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log("Server started".yellow.bold))

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin: "http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
  console.log("connected to socket.io");

  socket.on('setup',(userData)=>{    
     socket.join(userData._id);
     console.log(userData._id);
     socket.emit("connected");
  })

  socket.on('join chat',(room)=>{
     socket.join(room);
     console.log("user joined the room:"+room);
  })

  socket.on('typing',(room)=>socket.in(room).emit('typing'))
  socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

  socket.on('new message',(newMessageRecieved)=>{
     var chat = newMessageRecieved.chat;

     if(!chat.users)
     {
      return console.log("chat.users not defined");
     }

     chat.users.forEach(user => {
        if(user._id == newMessageRecieved.sender._id)
        {
          return;
        }
        socket.in(user._id).emit("message recieved",newMessageRecieved)
     });
  })
  
  socket.off('setup',()=>{
    console.log("user disconnected");
    socket.leave(userData._id)
  })
})
