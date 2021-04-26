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

    fs.mkdirSync(path_dir+body.farmName, (err) => {
        if (err) {
            console.log("Directory is create fail.");
            res.send({
                nessage : false
            })
        }else{

            
            console.log("Directory is created.");
            
        }
       
    });
    fs.mkdirSync(path_dir+body.farmName+"/RGB",(err)=>{

    })
    fs.mkdirSync(path_dir+body.farmName+"/NOIR",(err)=>{
        
    })
    fs.mkdirSync(path_dir+body.farmName+"/QR",(err)=>{
        
    })
    
    fs.appendFile(path_dir+body.farmName+'/FarmInfo.csv', '', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    fs.appendFile(path_dir+body.farmName+'/CaptureInfo.csv', '', function (err) {
    if (err) throw err;
    console.log('Saved!');
    });

    res.send({
        nessage : true
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