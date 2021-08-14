const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

// create user schema for mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String, // an object from class string
        required: true,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    // check if the user is a business or privet person
    biz: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, biz: this.biz }, config.get('jwtKey'));
    return token;
};

// creat the model for mongoose
const User = mongoose.model('User', userSchema);

// validation function using Joi
function validateUser(user) {

    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        biz: Joi.boolean().required()
    });

    return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;