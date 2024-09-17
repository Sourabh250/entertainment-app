const mongoose = require('mongoose');

// Defining the schema for a user
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
    id: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;