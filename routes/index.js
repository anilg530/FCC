var express = require('express');
var router = express.Router();
var courses = require('../controllers/courses.js')
var users = require('../controllers/users.js')
var visionController = require('../controllers/vision-controller');
var profileController = require('../controllers/profile-controller');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('home');

});

router.get('/login_page', function(req,res,next){

    res.render('loginPage')

})


//schedule routes
router.get('/upload_Schedule', function(req,res,next){
    res.render('upload_Schedule')
})

router.post('/save_schedule', function(req,res,next){
    var inputCourses = []
    for (var i = 0; i < req.body.length;i++){
        var name = "name" + i
        var submitName = req.body[name]

        var number = "number" + i
        var submitNumber = req.body[number]

        var section = "section" + i
        var submitSection = req.body[section]

        var days = "days" + i
        var submitDays = req.body[days]

        var startTime = "startTime" + i
        var submitStartTime = req.body[startTime]

        var endTime = "endTime" + i
        var submitEndTime = req.body[endTime]
        var courseName = submitName + " " + submitNumber + " " + submitSection

        var currentCourse = {
            name: courseName,
            days: submitDays,
            startTime: submitStartTime,
            endTime: submitEndTime
        }

        inputCourses.push(currentCourse)
    }
    console.log(inputCourses)
    req.session.courses = inputCourses
    courses.createAllCourses(req).then(() =>{
        courses.getAllCourses(req,res,next).then(value =>{
            res.redirect("/my_profile")
        })
        
    })

})

router.get('/confirm_schedule', function(req,res,next){
    console.log('is it working?')
    console.log("courses being saved in session: "+req.session.courses)
    var myCourses = req.session.courses
    for (var i = 0; i < myCourses.length;i++){
        var nameEdit = myCourses[i]['name'].split(" ")
        myCourses[i].name = nameEdit[0]
        myCourses[i].number = nameEdit[1]
        myCourses[i].section = nameEdit[2]
        console.log("going in the for")
    }
    console.log(JSON.stringify(req.session.courses))

    res.render('confirm_schedule',{ courses: myCourses })
})

router.post('/submit_schedule', function(req,res,next){
    console.log("going into submit schedule")
    if (!req.files){
        return res.status(400).send("No files were uploaded");
    } else {
        console.log("working fine")
    }


    let sampleFile = req.files.sampleFile;
    console.log(sampleFile)
    visionController.detect(sampleFile.data, req).then(()=>{
        console.log('2');
        res.redirect('confirm_schedule');
    });

})


//register routes
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


//profile routes
router.get('/profile/:id', function(req,res,next){
    console.log(req.param("id"))
    profileController.getProfileInfo(req,res, req.param("id"))
    
})
router.get('/my_profile', function(req,res,next){
    console.log("courses session: " + req.session.courses)
    res.render("my_profile",{ user: req.session.user })
})

router.post('/submit_bio', function(req, res,next){
    
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
