const mongoose = require('mongoose');

// Schema for searches
const searchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    searches: [{
        query: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        _id: false
    }]
}, {
    timestamps: true,
    id: false
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;