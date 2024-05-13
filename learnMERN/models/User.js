const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    emailAdresse: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema)