const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utilis/messages')
const { userJoin, getCurrentUser, userLeave, getUserRoom } = require('./utilis/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';
// Run when client Connects
io.on('connection', socket => {
    socket.on('joinRoom',({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        console.log(user);
        socket.join(user.room);
         //Welcome new usercl
    socket.emit('message', formatMessage(botName,'Welcome to ChatRoom'));

    //BroadCast when a user connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    });
    
    //Runs When a Client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message', formatMessage(botName,`${user.username} has left the chat`));

        
           io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUserRoom(user.room)
           });       
        }
    })

    //listen
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room)
          .emit('message',formatMessage(user.username,msg));
    })
    
})

const port = process.env.port || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));