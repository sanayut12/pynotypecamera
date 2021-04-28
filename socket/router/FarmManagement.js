var router = require('express').Router()
var path = require('path');
const fs = require('fs');
const qr = require("qrcode");
router.post('/createfarm',async (req,res)=>{
    var body = {
        farmName : req.body.farmName
    }
    console.log(body)
    var path_dir = "./data/"

    fs.mkdirSync(path_dir+body.farmName);
    fs.mkdirSync(path_dir+body.farmName+"/RGB",(err)=>{

    })
    fs.mkdirSync(path_dir+body.farmName+"/NOIR",(err)=>{
        
    })
    fs.mkdirSync(path_dir+body.farmName+"/QR",(err)=>{
        
    })
    
    fs.appendFile(path_dir+body.farmName+'/FarmInfo.csv', '', function (err) {
        if (err) throw err;
    });
    fs.appendFile(path_dir+body.farmName+'/CaptureInfo.csv', '', function (err) {
    if (err) throw err;
    });

    var list = await fs.readdirSync('./data/');
    res.send({
        list : list
    })

    
})


router.post('/addTree',async (req,res)=>{
    var body = {
        farmName : req.body.farmName,
        amount : req.body.amount
    }    
    var dataStructure = {
        farmName : body.farmName,
        no : 0,
        id : ""
    }
    var data = await fs.readdirSync('./data/'+body.farmName+'/QR');
    var number = data.length

    for (let i =0;i<body.amount;i++){
        var id = await  getRndInteger()
        dataStructure.id = id
        dataStructure.no = i+number+1
        var image = await qrcodeimage(JSON.stringify(dataStructure))
        var pathName = "./data/"+body.farmName+"/QR/"+dataStructure.no+'.jpg' 
        fs.writeFileSync(pathName,image,{encoding: 'base64'})
        var pathfarminfo = "./data/"+body.farmName+"/FarmInfo.csv" 
        fs.appendFileSync(pathfarminfo,JSON.stringify(dataStructure)+"\n")
    }

   
    var list = await fs.readdirSync('./data/'+body.farmName+'/QR');

    res.send({
        list : list
    })


})


router.get('/listfarm',async (req,res)=>{
    var list = await fs.readdirSync('./data/');
    res.send({
        list : list
    })
})

router.post('/listQrcode',async (req,res)=>{
    var body = {
        farmName : req.body.farmName
    }

    var path_dir = "./data/"+body.farmName+"/QR"

    var list = await fs.readdirSync(path_dir)
    res.send({
        list : list
    })
})

router.post('/listImageCapture',async (req,res)=>{
    var body = {
        farmName : req.body.farmName
    }
    console.log(body)

    var path_dirRGB = "./data/"+body.farmName+"/RGB"
    var path_dirNOIR = "./data/"+body.farmName+"/NOIR"

    var listRGB = await fs.readdirSync(path_dirRGB)
    var listNOIR = await fs.readdirSync(path_dirNOIR)
    res.send({
        listRGB : listRGB,
        listNOIR : listNOIR
    })
})

function getRndInteger() {
    return (Math.floor(Math.random() * (9999999999 - 1000000000 + 1) ) + 1000000000).toString();
}

async function qrcodeimage(dataStructure){

    var image = await qr.toDataURL(dataStructure,{
        type : 'image/jpeg'
    })
    qrImage = image.slice(22,image.length)
    return qrImage
}
module.exports  = router