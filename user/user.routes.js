const { register, requestResetPassword, resetPassword,  } = require('./user.controller')
const app = require('express')
const router = app.Router()

router.post('/', register)
router.post('/requestPassword', requestResetPassword)
router.post('/passwordReset', resetPassword)

module.exports = router
