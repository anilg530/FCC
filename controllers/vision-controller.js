var exports = module.exports = {};
var courseModel = require('../models/courseModel.js')

const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: './FirstClassConnect-service-account.json'
});

exports.detect = (image) => {
    //[A-Z]*\s[0-9]*-0\d
    var regexName = /[A-Z]{2,4}(?=\s[0-9])/g
    var regexNumber = /[0-9]{2,3}[A-C]*(?=-)/g
    var regexSection = /0(?!0)\d/g
    var regexTimes = /[0-9]{1,2}:\d{2}[A-Z]{2}/g
    var regexDays = /([A-Z][a-z]){1,2}(?![a-z])/g

    client.textDetection(image).then((results) => {
        const detections = results[0].textAnnotations;

        // console.log('Text:', detections[0].description);
        
        var names = detections[0].description.match(regexName)
        var sections = detections[0].description.match(regexSection)
        var numbers = detections[0].description.match(regexNumber)
        var times = detections[0].description.match(regexTimes)
        var days = detections[0].description.match(regexDays)

        // console.log('names: ', names.slice(4,8))
        // console.log('numbers: ', numbers)
        // console.log('sections: ', sections)
        // console.log('times: ', times)
        // console.log('days: ', days)

        var courses = []
        var nameIndex = 4
        var startIndex = 0
        var endIndex = 1
        for (var i = 0; i < numbers.length; i++){
            var currentCourse = courseModel.makeCourse(names[nameIndex], numbers[i], sections[i], days[i], times[startIndex], times[endIndex])
            courses.push(currentCourse)
            nameIndex++
            startIndex = startIndex + 2
            endIndex = endIndex + 2
        }
        console.log()
        console.log(courses)

    })

        .catch((err) => {
            console.log(err);
        });
}




