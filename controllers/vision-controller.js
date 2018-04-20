var exports = module.exports = {};
var courseModel = require('../models/courseModel.js')
var courseController = require('./courses.js')
var firebase = require('firebase')
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: './FirstClassConnect-service-account.json'
});



exports.detect = (image,req, res) => {

        //[A-Z]*\s[0-9]*-0\d
        var regexName = /[A-Z]{2,4}(?= [0-9])/g
        var regexNumber = /[0-9]{2,3}[A-C]*(?=-)/g
        var regexSection = /0(?!0)\d/g
        var regexTimes = /[0-9]{1,2}:\d{2}[A-Z]{2}/g
        var regexDays = /([A-Z][a-z]){1,2}(?![a-z])/g

        client.textDetection(image).then((results) => {
            const detections = results[0].textAnnotations;
            // console.log(detections[0])

            var departments = detections[0].description.match(regexName)
            var sections = detections[0].description.match(regexSection)
            var numbers = detections[0].description.match(regexNumber)
            var times = detections[0].description.match(regexTimes)
            var days = detections[0].description.match(regexDays)

            var courses = []

            var startIndex = 0
            var endIndex = 1
            
            for (var i = 0; i < numbers.length; i++) {
                var currentCourse = courseModel.makeCourse(departments[i] + " " + numbers[i] + " " + sections[i], days[i], times[startIndex], times[endIndex])
                courses.push(currentCourse)
                startIndex = startIndex + 2
                endIndex = endIndex + 2
            }
            
            console.log('user id: ' + req.session['user']['id'])
            var userId = req.session['user']['id']
            var coursesRef = firebase.database().ref('courses/').child("Spring 2018")
            req.session.courses = courses
            

        })
            .then(() => {
            createCourses(req);

            })

            .catch((err) => {
                console.log(err);
            });


    async function createCourses() {
        var coursesRef = firebase.database().ref('courses/').child("Spring 2018")

        var promise = new Promise((resovle, reject) => {
            courseController.createAllCourses(req)
            setTimeout(() => resovle(), 1000);
        })


        await promise

        console.log("goinghome")
        res.redirect('/homepage');

    }

}




// {"-LAQ5hcywSwy4AHHG0bU":{
//     "days":"We",
//     "endTime":"8:45PM",
//     "name":"SE 195B 01",
//     "startTime":"6:00PM",
//     "students":[
//         "lZUXECkltQObiViADDKT4APSYJ63",
//            "asdfasdflkjasdf"
//         ]
//     }   
// }