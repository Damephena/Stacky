const mongoose = require('mongoose')
const Joi = require('joi')

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

function validateResetEmail(user) {
    /**
     * Validate user inputted email 
    */
    const schema = Joi.object({
        email: Joi.string().min(5).required().email()
    })
    return schema.validate(user)
}

function validatePasswordReset(user) {
    /**
     * Validate user inputted reset information 
    */
    const schema = Joi.object({
        token: Joi.string().min(15).required(),
        userId: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
    })
    return schema.validate(user)
}

exports.Token = mongoose.model('Token', tokenSchema)
exports.resetEmailValidate = validateResetEmail
exports.confirmResetPassword = validatePasswordReset
