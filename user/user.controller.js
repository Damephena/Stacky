const { User, validate } = require('./user.model')
const bcrypt = require('bcrypt')
const _ = require('lodash')

exports.register = async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send({ detail: error.details[0].message })

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send({'detail': 'User with email already exists.'})

        requestBody = _.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'password'])

        if(requestBody.password !== req.body.confirmPassword) return res.status(400).send({detail: 'Password Mismatch'})

        user = new User(requestBody)
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()
        const data = _.pick(user, ['_id', 'firstName', 'lastName', 'email'])
        res.send(data)
    }
    catch (err) {
        console.log(err.message)
    }
}

