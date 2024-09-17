const mongoose = require('mongoose');

// Schema for bookmarks
const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true , unique: true},
    movieBookmarks: [{
        type: Number,
        required: true
    }],
    tvSeriesBookmarks: [{
        type: Number,
        required: true
    }]
}, {
    timestamps: true,
    id: false
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;