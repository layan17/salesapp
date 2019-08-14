var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('./key').MongoURI;
var User = require('./User');
var lagos = require('./lagos');
var moment = require('moment');


/* GET home page. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, party) {
      if(!err);
      res.render('index', {data:party, moment: moment});
   });
  });

mongoose.connect(db, {useNewUrlParser: true})
.then(()=>console.log('Mongo Connected'))
.catch(err => console.log(err));

// insert lagos
router.get('/insert', function(req, res, next){
  req.flash('success_messages', 'Last Amount Owned Paid. Add New Supply');
  res.render('insert');
});

router.post('/insert', function(req,res, next){
  const {owned, paid, remain, date} = req.body;
  if(!date || !owned  || !remain){
    req.flash('error', 'Fill in all Fields');
    res.redirect('/insert');
  }

  else{
    const newUser = new lagos({
      owned, 
      paid, 
      remain, 
      date

    });

    newUser.save()
    .then(()=>
    console.log('inserted')
    )
    .catch(err => console.log(err));
  }

  req.flash('success_messages', 'Lagos Account Inserted');
  res.redirect('/insert');
});


// insert Balance
router.get('/balance', function(req, res, next){
  res.render('balance');
});

router.post('/balance', function(req,res, next){
  const {date,  balance} = req.body;
  if(!date  || !balance ){
    req.flash('error', 'Fill in all Fields');
    res.redirect('/balance');
  }

  else{
    const newUser = new User({
      date, 
      balance

    });

    newUser.save()
    .then(()=>
    console.log('success'))
    .catch(err => console.log(err));
  }

  req.flash('success_messages', 'Balance added');
  res.redirect('/balance')
});




//update lagos
router.get('/update', function(req, res, next){
  lagos.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
    
    var d = post.remain; //fix
    t = parseInt(d);

    if(t == 0){
      req.flash('success_messages', 'Last Amount Owned Paid. Add New Supply');
      res.redirect('/insert');
    }
    else{
      lagos.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
        if(!err){
          var pays = post.paid
          var tota = pays.reduce((a, b) => a + b, 0); //sum paid        
          res.render('update', {data:post, tot : tota});
        }
       });
      }
  });
});


router.post('/update', function(req,res, next){
  const {owned, paidn, remain, date} = req.body;

  if(!date || !owned || !paidn ){
    req.flash('error', 'Fill in all Fields');
    res.redirect('/update');
  }

  // Query
  else {
  lagos.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
    if(!err){
      lagos.update(
    { _id: post.id }, 
    { $push: { 'paid': paidn, 'date': date  },  $set: { 'remain': remain} }, //push into an array
    { new: true }, //update values

   function (err, data) {
         if (err) {
             console.log(err);
         } else {
             console.log('success');
         }
     });
    }

    });

    req.flash('success_messages', 'Lagos Account Updated');
    res.redirect('/update')
  }

 
});


//update balance remove
router.get('/ubalance', function(req, res, next){
      User.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
        if(!err){     
          res.render('ubalance', {data:post});
        }
       });
});


router.post('/ubalance', function(req,res, next){
  const {date, nbalance, tbalance, removes} = req.body;
  if(!date || !nbalance || !removes){
    req.flash('error', 'Fill in date , previous balance, and remove Fields');
    res.redirect('/ubalance');
  }

  else {

  // Query
  User.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
    if(!err){
      User.update(
    { _id: post.id }, 
    { $push: { 'removes': removes, 'rdate': date  },  $set: { 'balance': nbalance} }, //push into an array
    { new: true }, //update values

   function (err, data) {
         if (err) {
             console.log(err);
         } else {
             console.log('success');
         }
     });
    }

    });
  }

  req.flash('success_messages', 'Balance Successfully Updated');
  res.redirect('/ubalance');
});

//update balance add
router.get('/abalance', function(req, res, next){
  User.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
    if(!err){     
      res.render('abalance', {data:post});
    }
   });
});

// update balance add
router.post('/abalance', function(req,res, next){
const {date, pbalance, nbalance, adding} = req.body;
if(!date || !pbalance || !nbalance || !adding){
req.flash('error', 'Fill in all Fields');
res.redirect('/abalance');
}

// Query

else{
User.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
if(!err){
  console.log(nbalance);
  User.update(
{ _id: post.id }, 
{ $push: { 'adding': adding, 'adate': date },  $set: { 'balance': nbalance} }, //push into an array
{ new: true }, //update values

function (err, data) {
     if (err) {
         console.log(err);
     } else {
         console.log('success');
     }
 });
}

});
}

req.flash('success_messages', 'Balance Successfully Updated');
res.redirect('/abalance');
});



router.get('/get', function(req,res, next){
  User.find({}, function(err, party) {
    if(!err)

    /*
    var adds = party[0].adding;
    var removes = party[0].removes;

    console.log(adds.reduce((a, b) => a + b, 0)); //sum paid
    console.log(removes.reduce((a, b) => a + b, 0)); //sum paid
    */
    res.render('get', {data:party, moment: moment});
 });

 
});

router.get('/laget', function(req,res, next){
  lagos.find({}, function(err, party) {
    if(!err)
    res.render('laget', {data:party, moment: moment});
 });

 
});

module.exports = router;
