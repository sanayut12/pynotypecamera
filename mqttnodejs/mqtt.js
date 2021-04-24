var mqtt = require('mqtt')
var client  = mqtt.connect('http://127.0.0.1:1883')
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
//   client.end()
})