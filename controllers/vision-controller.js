var exports = module.exports = {};
var courseModel = require('../models/courseModel.js')
var courseController = require('./courses.js')
var firebase = require('firebase')
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: './FirstClassConnect-service-account.json'
});



exports.detect = (image,req, res) => {


    var promise = new Promise((resolve, reject) => {
        var regexName = /[A-Z]{2,4}[0-9]?(?= [0-9])/g
        var regexNumber = /[0-9]{2,3}[A-Z]?(?=-)/g
        var regexSection = /(?<=-)\d{2}/g
        var regexTimes = /[0-9]{1,2}:\d{2}[A-Z]{2}|Room TBA/g
        var regexDays = /([A-Z][a-z]){1,2}(?![a-z])|Room TBA/g

        client.textDetection(image).then((results) => {
            const detections = results[0].textAnnotations;
            console.log(detections[0])

            var departments = detections[0].description.match(regexName)
            var sections = detections[0].description.match(regexSection)
            var numbers = detections[0].description.match(regexNumber)
            var times = detections[0].description.match(regexTimes)
            var days = detections[0].description.match(regexDays)

            var courses = []

            var startIndex = 0
            var endIndex = 1
            var timesCount = 0
            var daysCount = 0
            console.log("departments: ", departments)
            console.log("sections: ", sections)
            console.log("number: ", numbers)
            console.log("times: ", times)
            console.log("days: ", days)
            
            for (var i = 0; i < numbers.length; i++) {
                var currentCourse
                if (times[startIndex] == "Room TBA"){
                    currentCourse = courseModel.makeCourse(departments[i] + " " + numbers[i] + " " + sections[i], "Online", "Online", "Online")
                    timesCount++
                    startIndex++
                    endIndex++
                } else {
                    currentCourse = courseModel.makeCourse(departments[i] + " " + numbers[i] + " " + sections[i], days[i], times[startIndex], times[endIndex])
                    startIndex = startIndex + 2
                    endIndex = endIndex + 2
                }
                timesCount++
                daysCount++
                
                courses.push(currentCourse)
            }
            
            console.log('user id: ' + req.session['user']['id'])
            var userId = req.session['user']['id']
            var coursesRef = firebase.database().ref('courses/').child("Spring 2018")
            
            req.session.courses = courses
            //console.log(req.session.courses)
            resolve(courses);
        })

    })
    console.log('1');
    return promise;


}

    async function goToConfirmation() {
        var coursesRef = firebase.database().ref('courses/').child("Spring 2018")

        var promise = new Promise((resolve, reject) => {
            // courseController.createAllCourses(req)
            // setTimeout(() => resovle(), 1000);
        })


        await promise
        
        console.log("goinghome")



    }



