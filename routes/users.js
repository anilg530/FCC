var express = require('express');
var router = express.Router();
var users = require('../controllers/users.js')
var courses = require('../controllers/courses.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/sign_out', function(req,res,next){
        users.signOutUser(req, res, next)
})



router.get('/get_courses', function(req,res,next){
    if(!req.session.user) {
        res.redirect('login_page')
    } else {
        courses.getAllCourses(req, res, next)
            .then((courses) => {
                console.log("THE COURSES: ", courses);
                res.redirect('/homepage')
            })
    }
})

module.exports = router;
