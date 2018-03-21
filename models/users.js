var firebase = require('firebase')


module.exports = {
    createUser: function(req,res,next){
        
        var email = req.body.email
        var password = req.body.password
        console.log('creating user')
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function (error){
                var errorCode = error.computed
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            }
        )
    },

    logInUser: function(req,res,next){
        var email = req.body.email
        var password = req.body.password
        console.log("logging in")
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error){
            var errorCode = error.computed
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
    },

    signOutUser: function(req,res,next){
        firebase.auth().signOut().then(function(){
            console.log("Logged out!")
        })
        .catch(function(error){
            var errorCode = error.computed
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
    }
}