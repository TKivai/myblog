const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;