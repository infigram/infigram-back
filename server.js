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
    // const error = new Error('error message')
    // error.data = {errorData:'xyz'}
    // error.statusCode = 403
    // throw error
    res.status(202).json({message:'wordfgsdgked'})
})

app.use(require('./routes/feed'))

app.use((error, req, res, next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({error: message, data})
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