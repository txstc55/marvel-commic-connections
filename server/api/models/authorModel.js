const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema(
    {
        author_name: {
            type: String,
            required: "author needs a name"
        },
        _id: {
            type: Number,
            required: "author needs an id"
        },
        url: {
            type: String,
            default: 'authors/'
        },
        comic_count: {
            type: Number,
            default: 0
        },
        relatives: {
            type: Number,
            default: 0,
        },
        closest_authors: [],
    },
    { collection: 'authors' }
);

module.exports = mongoose.model("authors", authorSchema);