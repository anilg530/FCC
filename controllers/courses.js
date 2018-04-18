var firebase = require('firebase')

module.exports = {
    createCourse: function(name, days, startTime, endTime) {
        var coursesRef = firebase.database().ref('courses/').child("Spring 2018")
        
        // console.log('reference: ', coursesRef)

        coursesRef.push().set({
            name: name,
            days: days,
            startTime: startTime,
            endTime: endTime,
            students: []
        })
        .catch(function(error){
            var errorCode = error.computed
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
        })
    },


}