require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const port = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use((req ,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*') // * for all domains
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    next()
})

app.get('/test', (req, res, next)=>{
    res.status(202).send({message:'worked'})
})

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})
.then(()=>{
    app.listen(port,()=>{
        console.log(`app running on port ${port}`)
    })
})