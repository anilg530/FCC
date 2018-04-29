var firebase = require('firebase')

module.exports = {
    createPoll: function(req,res,next){
        var courseId = "-LB7g1_MvZgbPzcYl8xi"
        
        var pollRef = firebase.database().ref('polls/').child(courseId)

        // console.log('reference: ', pollRef)
        pollRef.push().set({
            title: req.body.title,
            description: req.body.description,
            options: [req.body.option1, req.body.option2],
        })
        .catch(function(error){
            var errorCode = error.computed
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
        })
        // console.log(1)
        // var pollRef = firebase.database().ref('polls/').child(courseId)
        // var poll = pollRef.push()
        // console.log(2)
        // console.log(pollRef)
        // poll.set({
        //     title: req.body.title,
        //     description: req.body.descriptin,
        //     options: [req.body.option1, req.body.option2],
        // }).then(value =>{
        //     res.redirect('/poll_form')
        // })
        
        
    },
    getPoll: function(req,res,next){
        var courseId = "-LB7g1_MvZgbPzcYl8xi"
        var pollId = "-LBDxoryKHN0A6NqZ4Us"
        var pollInfo
        var pollRef = firebase.database().ref('polls/').child(courseId).child(pollId)
        pollRef.once("value", function(snapshot){
            pollInfo = snapshot.val()
            
        }).then(value =>{
            console.log(JSON.stringify(pollInfo));
            res.render('answer_form');
        })
    },
    answerPoll: function(req,res,next){
        var courseId
        var pollId
        var pollRef = firebase.database().ref("polls/").child(courseId).child(pollId)
        pollRef.once("value", function(snapshot){
            if (snapshot.hasChild("answers")){
                pollRef.child("answers").transaction(function(answers){
                    if (answers){
                        answers.push(req.session.user['id'])
                    }
                    return answers
                })
            } else {
                pollRef.transaction(function(poll){
                    if (poll) {
                        if (!poll.answers){
                            poll.answers = [req.session.user['id']]
                        } else {
                            poll.answers.push(req.session.user['id'])
                        }
                    }
                })
            }
        }) 
    }
}