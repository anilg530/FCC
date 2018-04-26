var express = require('express');
var router = express.Router();
var courses = require('../controllers/courses.js')
var users = require('../controllers/users.js')

var profileController = require('../controllers/profile-controller');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('home');

});

router.get('/login_page', function(req,res,next){

    res.render('loginPage')

})

router.get('/register', function(req,res,next){
    res.render('signup')
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

router.get('/profile/:id', function(req,res,next){
    console.log(req.param("id"))
    profileController.getProfileInfo(req,res, req.param("id"))
    
})
router.get('/my_profile', function(req,res,next){
    console.log("courses session: " + req.session.courses)
    res.render("my_profile",{ user: req.session.user })
})


router.get('/userPhotoForm', (req,res) => {
    res.render('uploadUserImage');
})

router.post('/userPhoto', (req, res) => {
    profileController.uploadProfileImage(req, res);
})

router.get('/getCourses', (req, res) => {
    profileController.getCourses(req, res);
})


router.get('/chats', function(req,res,next){
    console.log(req.session.user);
    if (! ('user' in req.session) ) {
        res.redirect('/login_page');
    } else {
        courses.getAllCourses(req,res,next).then(
            courseData =>{
                console.log(courseData)
                res.render('chat', {
                    user: req.session.user,
                    courses: courseData
                });
            }
        )

    }

})

module.exports = router;
