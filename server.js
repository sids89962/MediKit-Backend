require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')


const app= express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))

// Connect to mongo
const URI = process.env.MONGO_URI
mongoose.connect(URI).then(() => {
    console.log('Connection Successful')
}).catch((error) => {
    console.error(error)
})

app.use('/users', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRoutes'))



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT} `)
})