const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var createfarm = require('./router/FarmManagement')
var imageNetwork = require('./router/ImageManagement')
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
  return next()
})
app.use('/farm',createfarm)
app.use('/image',imageNetwork)

app.get('/Qrcode/:farmname/:no', (req, res) => {
  const { no ,farmname} = req.params
  var pathImage = "./data/"+farmname+"/QR/"+no+".jpg"
  //C:\Users\Art\Desktop\aa\pynotypecamera\socket\data\farm1\QR\1.jpg
  res.sendFile(__dirname+"/data/"+farmname+"/QR/"+no)
})

app.get('/imageRGB/:farmname/:no', (req, res) => {
  const { no ,farmname} = req.params
  let pathImage = "/data/"+farmname+"/RGB/"+no
  //C:\Users\Art\Desktop\aa\pynotypecamera\socket\data\farm1\QR\1.jpg
  res.sendFile(__dirname+pathImage)
})

app.get('/imageNoir/:farmname/:no', (req, res) => {
  const { no ,farmname} = req.params
  let pathImage = "/data/"+farmname+"/NOIR/"+no
  //C:\Users\Art\Desktop\aa\pynotypecamera\socket\data\farm1\QR\1.jpg
  res.sendFile(__dirname+pathImage)
})

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
    // io.emit('mqttUI',data)
    var data=JSON.parse(data) 
    let key = data['key']
    let message = data['message']
    console.log(key)
    console.log(message)
    client.publish(key,message)
  })
});


server.listen(3001, () => {
  console.log('socket running port http://localhost:3001');
});


app.listen(3002,()=>{
  console.log('http running port http://localhost:3002')
})