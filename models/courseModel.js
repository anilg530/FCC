module.exports = {
    makeCourse: function(semester, department, number, section, days, startTime, endTime){
        var course = {
            semester: semester,
            department: department,
            number: number,
            section: section,
            days: days, 
            startTime: startTime,
            endTime: endTime
        }
        return course
    }
}