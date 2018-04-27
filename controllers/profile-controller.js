var exports = module.exports = {}
var firebase = require('firebase')
var cloudinary = require('cloudinary')




module.exports = {
    getProfileInfo: function(req,res,profileId) {
        var profileRef = firebase.database().ref('users/').child(profileId)
        var profileInfo;
        var profileCourses = []
        profileRef.once("value", function(snapshot){
            profileInfo = snapshot.val()
            console.log(JSON.stringify(profileInfo.courses))
            //CHECK THIS!
            console.log("session courses",req.session.courses)

            for (var i = 0; i < profileInfo.courses.length; i++){
                for (var j = 0; j < req.session.courses.length;j++){
                    if (profileInfo.courses[i] == req.session.courses[j]['id']){
                        console.log(req.session.courses[j]['name'])
                        profileCourses.push(req.session.courses[j])
                    }
                }
            }
        }).then(
            profile => {

                res.render("profile",{ profile: profileInfo, profileCourses: profileCourses })
            }
        )
    },
    addBio: function(req,res){
        var user = req.session.user;
        var userRef = firebase.app().database().ref('users').child(user['id']);


        req.session.user['bio'] = req.body['bio'] //saves the bio in the user session

        userRef.once("value", (snapshot) => {
            userRef.update({
                biography: req.body['bio']
            }).then(
                value => {
                    res.redirect('/my_profile')
                }
            )
        });
    }


}



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