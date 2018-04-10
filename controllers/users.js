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
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        classes: []
                    }

                    req.session.user = user.uid
                    console.log(req.session)
                    firebase.database().ref('users/' + user.uid).set(newUser)
                        .then(
                        data => {
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
                console.log(req.session.user)
                firebase.database().ref('users/').once('value', function (snapshot) {
                    console.log(user.uid)

                    // before is session.user = user.id; change for passing user's info to front-end
                    req.session.user = user;//{uid: user.uid, email: user.email, accessToken: user.accessToken}
                    // req.session.user = user.uid

                    console.log(req.session.user)
                    console.log('going here')
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
    }
}
