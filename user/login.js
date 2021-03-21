const { User } = require('./user.model')

const Joi = require('joi')
const bcrypt = require('bcrypt')
const app = require('express')
const router = app.Router()

router.post('/', async (req, res) => {
    const { error } = validateLogin(req.body)
    if (error) return res.status(400).send(
        {detail: error.details[0].message}
    )
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send({
            'detail': 'Invalid Email or Password'
        })

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send({
            'detail': 'Invalid Email or Password'
        })

        const token = user.generateAuthToken()

        res.send({token: token})
    }
    catch (err){
        res.status(err.response.status).send({'error': err.message})
    }
    
})


function validateLogin (req){
    
    const schema = Joi.object({
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(req)
}

// module.exports = { auth }
module.exports = router
