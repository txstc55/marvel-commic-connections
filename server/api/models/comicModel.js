const mongoose = require('mongoose');
const { Schema } = mongoose;

const comicSchema = new Schema(
    {
        comic_name: {
            type: String,
            required: "comic needs a name"
        },
        _id: {
            type: Number,
            required: "comic needs an id"
        },
        url: {
            type: String,
            default: 'comics/'
        },
        author_ids: [],
        character_ids: []
    },
    { collection: 'comics' }
);

module.exports = mongoose.model("comics", comicSchema);