

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chatContainer')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('userList')
const hamburger = document.querySelector('.hamburger')
const menu = document.querySelector('.menu')


//ADDING AUDIO  
const audio = new Audio('/static/notification.mp3')
const incomming = new Audio('/static/incomming.mp3')
const sent = new Audio('/static/sent.mp3')


//GET USERNAME AND ROOM FROM URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true

})  

// const socket = io('https://chat0n.herokuapp.com/')
const socket = io('192.168.43.18:3000')


//JOIN CHAT ROOM
socket.emit('joinRoom', {username, room})



// GET ROOM AND USERS
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

 
//LISTENING FROM THE SERVER
socket.on('message', message =>{
    console.log(message)
    incomming.pause()
    incomming.currentTime = 0
    incomming.play()
    outputMessage(message, 'center')
    //SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('chatMessage', msg => {
    console.log(msg)
    audio.pause();
    audio.currentTime = 0;
    audio.play()
    outputMessage(msg, 'left')
    //SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight 
    
})

socket.on('sentMessage', msg => {
    
    sent.pause()
    sent.currentTime = 0
    sent.play()
    outputMessage(msg, 'right')
    

    //SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight
})




//EVENT LISTNER FOR MESSAGE SEND
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    //Get message Text
    const msg = e.target.elements.msg.value

    //Emitting it to the server
    socket.emit('chatMessage',msg)

    
    //CLEAR INPUT
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

  
})



//OUTPUT MESSAGE TO DOM
function outputMessage(msg, position){
    const div = document.createElement('div')
    div.classList.add(position)
    if(position == 'center'){
        div.innerHTML = `<p class="text"> '${msg.username}' ${msg.text}</p>`
    }
    else if(position == 'left'){
        div.innerHTML = `<p class="meta">${msg.username} : <span>${msg.time}</span> </p>
        <p class="text"> ${msg.text}</p> ` 
        audio.play() 
    }
    else{
        div.innerHTML = `<p class="meta">You : <span>${msg.time}</span> </p>
        <p class="text"> ${msg.text}</p> `
    }
    
    chatMessages.appendChild(div)

}

// ADD ROOM NAME TO DOM
function outputRoomName(room){
    roomName.innerText = room
}


// ADD USERS TO THE DOM 
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li class='name'><img id="img" src="../static/img/online_icon.png" alt="online"><p id='username'>${user.username}</p></li>`).join('')}`
}



hamburger.addEventListener('click', () => {
    menu.classList.toggle('open')
})