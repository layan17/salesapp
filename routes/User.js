var mongoose = require('mongoose');


var lCalc = new mongoose.Schema({

    balance: {
        type: Number
    },


    adding: [Number],

    removes: [Number],

    rdate: [Date],
    adate: [Date],
    date: [Date]
           
});

var User = mongoose.model('lCalc', lCalc);


module.exports = User;