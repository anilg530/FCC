var firebase = require('firebase');
var visionController  = require('../controllers/vision-controller');
var coursesController = require('../controllers/courses.js')

module.exports = {
    createUser: function(req,res,next) {
        var email = req.body.email
        var password = req.body.password
        console.log('creating user')
        console.log(email);
        console.log(password);
        console.log(req.body.firstName);
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                user => {
                      newUser = {
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName

                    }

                    req.session.user = newUser
                    req.session.user['id'] = user.uid
                    console.log(req.session)
                    firebase.database().ref('users/' + user.uid).set(newUser)
                        .then(
                            data => {
                                console.log('user created')
                                //     return res.status(400).send("No files were uploaded");
                                //
                                // let sampleFile = req.files.sampleFile;
                                // visionController.detect(sampleFile.data, req);
                                // this.logInUser(req,res)


                                res.redirect('/upload_Schedule')

                            })


                        .catch( 
                            error => {
                                console.log(error)
                                res.redirect('/')
                            }
                        )
                }
            )
            .catch(function (error) {
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
                    coursesController.getAllCourses(req,res,next).then(value => {
                        console.log("getting courses successful")
                        res.redirect('/my_profile')
                    })
                    
                    
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
