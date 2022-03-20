const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: {
        type: String,
    },
    desc: {
        type: String,
    },
    total: {
        type: Number,
        default: 0,
    },
    own: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

const deck = mongoose.model('Deck', deckSchema);

module.exports = deck;