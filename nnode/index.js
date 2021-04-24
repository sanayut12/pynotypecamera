var express = require('express')
var path = require('path') 
var app = express()
var post = 3001 || process.env.post


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


app.get('/',(req,res)=>{
	function click(){
		console.log('dsdsdsdsd')
	}

	res.send("<h1><button onclick='click()'>click</button></h1>")
})


app.get('/video',(req,res)=>{
	res.render("index")
})
//http://127.0.0.1:8000/noir  <iframe  src='http://127.0.0.1:8000/rgb' title='description' style='height:180px;width:320px'>
app.listen(post,()=>{
	console.log(`runnind http://localhost:{port}`)
})
