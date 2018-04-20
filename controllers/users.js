var firebase = require('firebase')


module.exports = {
    createUser: function(req,res,next){
        var email = req.body.email
        var password = req.body.password
        console.log('creating user')
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                user => {
                    newUser = {
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        photo: null
                        
                    }
                    req.session.user = newUser
                    firebase.database().ref('users/' + user.uid).set(newUser)
                        .then(
                        data => {
                            req.session.user['id'] = user.uid
                            console.log('user created')
                            res.redirect('/homepage')
                        })
                        .catch(
                            error => {
                                console.log(error)
                                res.redirect('/')
                            }
                            
                    )
                }
            )
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
        .then(
            user => {
                firebase.database().ref('users/').child(user.uid).once('value', function (snapshot) {
                    req.session.user = snapshot.val()
                    console.log(user.uid)
                    req.session.user['id'] = user.uid
                    console.log(req.session.user)
                    res.redirect('/homepage')
                })
                
                
            }
        )
        .catch(function(error){
            console.log('is it going here')
            var errorCode = error.computed
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
    },

    signOutUser: function(req,res,next){
        console.log('signing out user')
        firebase.auth().signOut().then(function(){
            req.session.destroy()
            res.redirect('/login_page')
        })
        .catch(function(error){
            var errorCode = error.computed
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
    },
    deleteUsers: function(){
        
        var userRef = firebase.database().ref('users/')
        userRef.remove()
    }
}