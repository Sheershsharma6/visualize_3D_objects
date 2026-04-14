const mongoose = require('mongoose');

const ObjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: String,
    s3Url: { type: String, required: true },
    // This stores the rotation/zoom for persistence
    interactionState: {
        position: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 }, z: { type: Number, default: 5 } },
        rotation: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 }, z: { type: Number, default: 0 } }
    }
});

module.exports = mongoose.model('ObjectModel', ObjectSchema);