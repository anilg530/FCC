var express = require('express');
var router = express.Router();
var courses = require('../controllers/courses.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login_page', function(req,res,next){
  res.render('loginPage')
})

router.get('/homepage', function(req,res,next){
  if (! ('user' in req.session)){
    res.redirect('/login_page')
  } else {
    res.render('homepage')
  }
  
})

router.get('/course_page', function(req,res,next){
  res.render('course_page')
})

router.post('/submit_course', function(req,res,next){
  courses.createCourse(req,res,next)
})


module.exports = router;
