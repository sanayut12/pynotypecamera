const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var createfarm = require('./router/FarmManagement')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.json())
app.use('/farm',createfarm)

//mqtt
var mqtt = require('mqtt')
var client  = mqtt.connect('http://127.0.0.1:1883')
client.on('connect', function () {
client.subscribe('mqtt', function (err) {
    if (!err) {
    client.publish('mqtt', 'Hello mqtt')
    }
})
})

client.on('message', function (topic, message) {
// message is Buffer
console.log(message.toString())
io.emit('mqtt',message.toString())
//   client.end()
})
//socket.io
io.on('connection', (socket) => {
  socket.on('message',function(data){
    io.emit('mqtt',data)
  })
});


server.listen(3001, () => {
  console.log('socket running port http://localhost:3001');
});


app.listen(3002,()=>{
  console.log('http running port http://localhost:3002')
})