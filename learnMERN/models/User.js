const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)