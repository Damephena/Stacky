const jwt = require('jsonwebtoken')
const config = require('./config/config').get(process.env.NODE_ENV)

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send({ detail: 'Access denied. No token provided.' })

    try{
        const decoded = jwt.verify(token, config.SECRET)
        req.user = decoded
        next()
    }
    catch (err){
        res.status(400).send({ detail: 'Invalid Token'})
    }
}
