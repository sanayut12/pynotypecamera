var mqtt = require('mqtt')
var express = require('express')
var app = express()
var path= require('path')
var port = 3002||process.env.port



app.use(express.static('public'))
app.use('/css',express.static(__dirname+'public/css'))
app.use('/js',express.static(__dirname+'public/js'))
app.use('/img',express.static(__dirname+'public/img'))

app.set('views','./views')
app.set('view engine','ejs')

var client = mqtt.connect('http://127.0.0.1:1883')
client.on('connect',()=>{
    console.log('connect')
})
app.get('/',(req,res)=>{
    res.render("index")
})
app.listen(
    port,()=>{
        console.log(`app running http://localhost:`+port)
    }
)