module.exports = {
    makeCourse: function(name, days, startTime, endTime){
        var course = {
            name,
            days: days, 
            startTime: startTime,
            endTime: endTime
        }
        return course
    }
}