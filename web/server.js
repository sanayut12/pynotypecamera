
var express = require('express')
var app = express()
var path= require('path')
var port = 3002||process.env.port
var routerindex = require('./router/index')


// app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')))
// app.use('/js',express.static(__dirname+'public/js'))
// app.use('/img',express.static(__dirname+'public/img'))

app.set('views','./views')
app.set('view engine','ejs')


app.use('/camera',routerindex)
app.get('/',(req,res)=>{
    res.render("index")
})

app.listen(
    port,()=>{
        console.log(`app running http://localhost:`+port)
    }
)