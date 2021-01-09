const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director', required: true },
    musicDirector: {type: mongoose.Schema.Types.ObjectId, ref: 'MusicDirector', required: true},   
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Movie', schema);