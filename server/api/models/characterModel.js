const mongoose = require('mongoose');
const {Schema} = mongoose;

const characterSchema = new Schema(
    {
        character_name: {
            type: String,
            required: "Character needs a name"
        },
        _id:{
            type: Number,
            required: "Character needs an id"
        },
        url: {
            type: String,
            default: 'characters/'
        },
        comic_ids:[]
    },
    {collection: 'characters'}
);

module.exports = mongoose.model("characters", characterSchema);