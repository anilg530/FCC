var firebase = require('firebase')

module.exports = {
    createCourse: function(req,res,next) {
        var coursesRef = firebase.database().ref('courses/')
        console.log('department: ' + req.body.department)
        console.log('course number: ' + req.body.courseNumber)
        console.log('section: ' + req.body.section)
        console.log('going in courses')
        // console.log('reference: ', coursesRef)


        coursesRef.push().set({
            department: req.body.department,
            courseNumber: req.body.courseNumber,
            section: req.body.section,
            students: []
        })
        .catch(function(error){
            var errorCode = error.computed
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
        })
        
        console.log('setting')
    },


}