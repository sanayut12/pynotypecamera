var mqtt = require('mqtt')
var express = require('express')
var app = express()
var client = mqtt.connect('wxs://test.mosquitto.org')
client.on('connect',()=>{
    console.log('connect')
})
app.get('/',(req,res)=>{
    res.send("<h1>HELLO</h1>")
})
app.listen(
    3000
)