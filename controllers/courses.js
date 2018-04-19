var firebase = require('firebase')

module.exports = {
    createCourse: function(course) {
        var coursesRef = firebase.database().ref('courses/').child("Spring 2018")
        
        // console.log('reference: ', coursesRef)

        coursesRef.push().set({
            name: course.name,
            days: course.days,
            startTime: course.startTime,
            endTime: course.endTime,
            students: []
        })
        .catch(function(error){
            var errorCode = error.computed
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
        })
    },
    createAllCourses: function(req){
        var coursesRef = firebase.database().ref('courses/').child("Spring 2018")
        req.session.courses.forEach(function(course){
            coursesRef.orderByChild("name").equalTo(course['name']).once("value", function(snapshot){
                console.log("key: " + snapshot.key)
                console.log("values: "+JSON.stringify(snapshot.val()))
                if (!snapshot.val()){
                    coursesRef.push().set({
                    name: course.name,
                    days: course.days,
                    startTime: course.startTime,
                    endTime: course.endTime,
                    students: [req.session.user['id']]
                    })
                    .catch(function(error){
                        var errorCode = error.computed
                            var errorMessage = error.message;
                            console.log(errorCode)
                            console.log(errorMessage)
                    })
                } else {
                    
                    console.log("course exists")
                    var newCourse
                    snapshot.forEach(function(data){
                        var item = {
                            key: data.key,
                            students: data.val().students,
                        }
                        item['students'].push(req.session.user['id'])
                        newCourse = item
                    })  
                    
                    console.log("values: "+JSON.stringify(snapshot.key))
                    console.log("course exists")
                    
                    var studentCourseRef = firebase.database().ref('courses/').child("Spring 2018").child(newCourse['key']).child("students")
                    studentCourseRef
                    .transaction(function(students){
                        students = newCourse['students']
                        return students
                    })
                }
                
            })
            
        })
    }


}