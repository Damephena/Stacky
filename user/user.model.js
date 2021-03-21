const config = require('../config/config').get(process.env.NODE_ENV)

const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        required: true
    },
    lastName: {
        type: String,
        required: false,
        minLength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 5
    },
    password: {
        type:String,
        required: true,
        minlength:6
    },
})

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({ _id: this._id  }, config.SECRET)
    return token
}

function validateUser(user) {
    /**
     * Validate user inputted data 
    */
    const schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
    })
    return schema.validate(user)
}

exports.User = mongoose.model('User', userSchema)
exports.validate = validateUser
