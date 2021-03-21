const { User, validate } = require('./user.model')
const { Token, resetEmailValidate, confirmResetPassword } = require('./token.model')
const sendEmail = require('../utils/emails/sendEmail')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const _ = require('lodash')

exports.register = async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send({ detail: error.details[0].message })

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send({ 'detail': 'User with email already exists.' })

    requestBody = _.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'password'])

    if (requestBody.password !== req.body.confirmPassword) return res.status(400).send({ detail: 'Password Mismatch' })

    user = new User(requestBody)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()
    const data = _.pick(user, ['_id', 'firstName', 'lastName', 'email'])

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(data)
}

exports.requestResetPassword = async (req, res) => {
    const clientURL = 'http://localhost:8000/api/users'
    const { error } = resetEmailValidate(req.body)
    if (error) return res.status(400).send({ detail: error.details[0].message })

    const user = await User.findOne({email: req.body.email})

    if (!user) return res.status(400).status('User does not exist')

    let token = await Token.findOne({ userId: user._id })
    if (token) await token.deleteOne()

    let resetToken = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(resetToken, Number(10))

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save()

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`
    sendEmail(
        user.email,
        'Stacky: Password Reset Request',
        {name: user.firstName, link: link},
        './template/requestResetPassword.handlebars'
    )
    return res.status(200).send({'link': link})
}

exports.resetPassword = async(req, res) => {
    const { error } = confirmResetPassword(req.body)
    if (error) return res.status(400).send({ detail: error.details[0].message })

    requestBody = _.pick(req.body, ['userId', 'token', 'password'])
    if (requestBody.password !== req.body.confirmPassword) return res.status(400).send({ detail: 'Password Mismatch' })

    let passwordResetToken = await Token.findOne({ userId: requestBody.userId })
    if (!passwordResetToken){
        res.status(400).status({detail: 'Invalid or expired password reset token.'})
    }

    const isValid = await bcrypt.compare(requestBody.token, passwordResetToken.token)

    if (!isValid){
        res.status(400).send({
            detail: 'Invalid or expired reset token'
        })
    }

    const hash = await bcrypt.hash(requestBody.password, Number(10))
    await User.updateOne(
        { _id: requestBody.userId },
        { $set: { password: hash }},
        { new: true }
    )

    const user = await User.findById({ _id: requestBody.userId })
    sendEmail(
        user.email,
        'Stacky: Password Reset Successfully',
        {
            name: user.firstName
        },
        './template/resetPassword.handlebars'
    )
    await passwordResetToken.deleteOne()
    return res.status(200).send({detail: 'Password reset successfully! Login to your account'})
}
