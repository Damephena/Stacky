const { register } = require('./user.controller')
const app = require('express')
const router = app.Router()

router.post('/', register)

module.exports = router
