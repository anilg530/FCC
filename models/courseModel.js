module.exports = {
    makeCourse: function(name, number, section, days, timeStart, timeEnd){
        var course = {
            name: name,
            number: number,
            section: section,
            days: days,
            timeStart: timeStart,
            timeEnd: timeEnd
        }
        return course
    }
}