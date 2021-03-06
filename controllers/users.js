var firebase = require('firebase');
var visionController  = require('../controllers/vision-controller');
var coursesController = require('../controllers/courses.js')
const noImageUrl = 'https://res.cloudinary.com/dbq9jhgoi/image/upload/v1524989020/no-image.png'

module.exports = {
    createUser: function(req,res,next) {
        var email = req.body.email
        var password = req.body.password
        console.log('creating user')
        console.log(email);
        console.log(password);
        console.log(req.body.firstName);
        req.session['registerError'] = null;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                user => {
                      newUser = {
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        photoUrl: noImageUrl

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
                            }
                        )
                }
            )
            .catch(function (error) {
                    var errorCode = error.computed
                    var errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                req.session['registerError'] = errorMessage
                res.redirect('/register')
                }
            )
    },


    logInUser: function(req,res,next){
        var email = req.body.email
        var password = req.body.password
        console.log("logging in")
        req.session['loginError'] = null;
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
        .catch(function(error) {
            console.log('is it going here')
            var errorCode = error.computed
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            req.session['loginError'] = errorMessage;
            res.redirect('/login_page')
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
    getProfile(profileId){
        var userRef = firebase.database('users').child(profileId)
        var profileData
        userRef.once("value", function(snapshot){
            console.log(snapshot.val())
            profileData = snapshot.val()
            return profileData
        })
        
    }
}
