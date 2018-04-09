module.exports = {
    makeCourse: function(name, number, section, days, startTime, endTime){
        var course = {
            name: name,
            number: number,
            section: section,
            days: days, 
            startTime: startTime,
            endTime: endTime
        }
        return course
    }
}