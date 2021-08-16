const mongoose = require('mongoose');
const { Schema } = mongoose;

const metadataSchema = new Schema(
    {
        _id: {
            type: Number,
            required: "i have no idea why i need an id"
        },
        query_count: {
            type: Number,
            default: 1
        }
    },
    { collection: 'metadata' }
);

module.exports = mongoose.model("metadata", metadataSchema);