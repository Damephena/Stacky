const userRoutes = require('./user/user.routes')
const login = require('./user/login')

const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('./config/config').get(process.env.NODE_ENV)

const app = express()
const port = process.env.PORT || 8000
app.set('port', port)

app.use(helmet())
app.use(logger('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())

mongoose.Promise = global.Promise
mongoose.connect(
    db.DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Successfully connected to DB')
    }).catch(err => {
        console.log('Couldn\'t connect to DB. Exiting now...', err)
        process.exit()
    })

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Stacky application')
})
app.use('/api/users', userRoutes)
app.use('/api/login', login)

app.listen(port, () => { console.log(`Server running on port ${port}`)})
