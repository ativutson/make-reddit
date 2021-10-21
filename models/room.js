const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    topic: { type: String, required: true }
});

module.exports = mongoose.model('Room', roomSchema);