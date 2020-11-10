if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const indexRouter = require('./routes/index')

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.use('/articles',articleRouter)
app.use('/',indexRouter)

app.listen(process.env.PORT || 5000)