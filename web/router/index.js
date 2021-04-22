var router = require('express').Router()
var mqtt = require('mqtt')

function connectionMQTT(){   
    var client = mqtt.connect('http://127.0.0.1:1883')
    client.on('connect',()=>{
        console.log('connect mqtt')
        
    })
    // return "RRr"
}
function subMQTT(){
    var client = mqtt.connect('http://127.0.0.1:1883')
    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString())
        return message.toString()
      })
      
}

function pubMQTT(){
    console.log("public web")
    var client = mqtt.connect('http://127.0.0.1:1883')
    client.publish('presence', 'Hello mqtt')
}

router.get("/",(req,res)=>{
    res.render('index',{
        mqttconnect : connectionMQTT,
        pubmqtt : pubMQTT,
        submqtt : subMQTT
    })
})




module.exports = router