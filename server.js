//IMPORTS
const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
// const users = require('./utils/users')


//SETUP'S
const app = express()
const server = http.createServer(app)
const io = socket(server)
port = 80 || process.env.PORT;


//EXPRESS STUFF
app.use('/static', express.static('static'))

//PUG STUFF
app.set('view engine', 'pug')  //Set the template engine as pug
app.set('views', path.join(__dirname, 'views'))  //Set the views directory.




//ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render("index.pug")
})

app.get('/login', (req, res) => {
    res.status(200).render("login.pug")
})


app.get('/chat', (req, res) => {
    res.status(200).render("chat.pug")
})




//START THE SERVER
server.listen(port, () => {
    console.log(`The server is running in port: ${port}`)
})



//SOCKET.IO CONNECTIONS
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        //JOINING THE ROOM
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        //WELCOME CURRENT USER 
        socket.emit('message', formatMessage(``, `Hello <span style = "color: rgb(120, 0, 145); font-weight: bold; text-transform: uppercase">${user.username} !</span> Welcome to ChatOn ! ''`))

        //BROADCAST WHEN A USER CONNECTS 
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username, ' joined the Chat'))

        // USERS AND ROOM INFO
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    //LISTEN FOR CHAT MESSAGE
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        socket.emit('sentMessage', formatMessage(user.username, msg))
        socket.broadcast.to(user.room).emit('chatMessage', formatMessage(user.username, msg))
    })

    //BROADCAST WHEN A USER LEAVES
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, ' left the Chat'))
        }


        // USERS AND ROOM INFO
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

})















