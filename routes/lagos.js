var mongoose = require('mongoose');

var lagos = new mongoose.Schema({
    owned: {
        type: Number
    },

    date: [Date],

    paid: [Number],

    remain: {
        type: Number
    }
});

var lagos = mongoose.model('lagos', lagos);

module.exports = lagos;