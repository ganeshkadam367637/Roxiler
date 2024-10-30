var express = require('express')
var app = express()
var bodyparser = require("body-parser")
var cors = require('cors')

app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

app.get("/",async function (req,res){
    
    const result = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    const data = await result.json()
    try{
        const transact = data.map((item)=>({
            id: item.id,
            title: item.title,
            price: item.price.toString().substring(0,6),
            description: item.description,
            category: item.category,
            image: item.image,
            sold: item.sold,
            dateOfSale: item.dateOfSale,
            
        }))
        res.json(transact);
    }catch{
        console.log('error backend')
    }
})

app.get('/statistics',async function(req,res){
    const result = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    const data = await result.json()
    try{
        const transact = data.map((item)=>({
            id: item.id,
            dateOfSale: item.dateOfSale.slice(0,10),
            sold : item.sold,
            price : item.price.toString().substring(0, 5)
        }))
        res.json(transact);
    }catch{
        console.log('error backend')
    }
   


})
app.listen(1000,()=>{
    console.log("connected to Server Port:1000")
})