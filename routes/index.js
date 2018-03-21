var express = require('express');
var router = express.Router();
var users = require('../models/users.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/new_user', function(req,res,next){
  console.log("making new user")
  users.createUser(req,res,next)
})

router.get('/homepage', function(req,res,next){
  res.render('homepage')
})

router.get('/login_page', function(req,res,next){
  res.render('loginPage')
})

router.post('/login_user', function(req,res,next){
  users.logInUser(req,res,next)
})


module.exports = router;
