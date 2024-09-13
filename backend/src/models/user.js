const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    movieBookmarks: [{
        type: Number,
        required: true
    }],
    tvSeriesBookmarks: [{
        type: Number,
        required: true
    }],
    searches: [{
        query: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        _id: false
    }]
}, {
    timestamps: true,
    id: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;