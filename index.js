// modules
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


// variables
const userRoute = require('./src/routes/user.route')
const dbURI = process.env.dbURI

const corsOptions = {
 origin: true,
 credentials: true,
 optionsSuccessStatus: 204
}


// database connection
mongoose.connect(dbURI, { 
 useNewUrlParser: true, 
 useUnifiedTopology: true, 
 useCreateIndex: true }, () => {
 
 server.listen(5000, () => {
  console.info('DATABASE CONNECTED && SERVER IS UP')
 })
})


// middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// socket configuration
io.on('connection', (socket) => {
 console.log(socket)
 socket.emit('your id', socket.id)
 socket.on('inbox', body => {
  io.emit('outbox', body)
 })
})


// routes
app.use(userRoute)


// error pages
// app.use(express.static('public'))