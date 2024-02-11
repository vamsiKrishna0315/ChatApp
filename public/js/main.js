const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users'); 

// GET username and room from URL
const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});
const socket = io();

// console.log(username, room);
socket.emit('joinRoom', {username, room});

//
socket.on('roomUsers',({ room, users}) => {
    outputRoomName(room);
    outputUs(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get msg text
    const msg = e.target.elements.msg.value;

   socket.emit('chatMessage', msg);

   //clear input
   e.target.elements.msg.value ='';
   e.target.elements.msg.focus();
})

function outputMessage(message){
    console.log("36", message);
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name

function outputRoomName(room)
{
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}