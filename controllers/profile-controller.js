var exports = module.exports = {}
var firebase = require('firebase')

exports.editStudentEmail= (req, res) => {
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
    if (!req.files)
        return res.status(400).send('No photo was uploaded.');

    var user = req.session.user;
    var userRef = firebase.app().database().ref('users').child(user.id);

    let profilePhoto = req.files.profilePhoto;

    userRef.once("value", (snapshot) => {
        userRef.update({
            userPhoto: profilePhoto.data
        });
    })

        .catch((err) => {
            res.send(404).json({
                message: err
            });
        });
}