var exports = module.exports = {}
var firebase = require('firebase')
var cloudinary = require('cloudinary')



exports.editStudentEmail = (req, res) => {
    //var user = req.session.user;
}

exports.addBio = (req, res) => {
    var user = req.session.user;
    var userRef = firebase.app().database().ref('users').child(user.id);

    userRef.once("value", (snapshot) => {
        userRef.update({
            biography: req.session.bio
        })
    });
}

exports.getCourses = (req, res) => {
    var user = req.session.user;
    var courseRef = firebase.app.database.ref('courses').child(user.id);

   var courses =  courseRef.on("child_added", (snapshot) => {})

}

exports.uploadProfileImage = (req, res) => {
    var user = req.session.user;

    var userRef = firebase.app().database().ref('users').child(user.id);

    var promise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((result) => {
            resolve(result);
        }).end(req.files.photo.data)


    }).then((result) => {

        userRef.update({
            photoUrl: result.secure_url
        })
        req.session.user['photoUrl'] = result.secure_url;

        console.log(req.session.user);
    })
        .catch((error) => {
        console.log(error);
    });

}