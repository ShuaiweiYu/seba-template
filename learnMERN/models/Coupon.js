const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    assignedTo: {
        // todo: maybe only string
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        required: true
    }
})