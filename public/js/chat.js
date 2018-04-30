// Initialize Firebase
var config = {
    apiKey: "AIzaSyCmLCSDCOkj2xBzjtbPT4JUZi2-dA4Jebo",
    authDomain: "fcc-chat-25393.firebaseapp.com",
    databaseURL: "https://fcc-chat-25393.firebaseio.com",
    projectId: "fcc-chat-25393",
    storageBucket: "fcc-chat-25393.appspot.com",
    messagingSenderId: "725788913392"
};
firebase.initializeApp(config);

function init() {
    //var currentUser = <%= JSON.stringify(user) %>;

     $.showLoading({
         name: "circle-fade"
     });//     Change the default loader style. Available loader names:
        //
        //     line-pulse
        //     jump-pulse
        //     circle-turn
        //     circle-turn-scale
        //     circle-fade
        //     square-flip
        //     line-scale

    if(currentUser.id != null) {

        var email = currentUser.email;
        var password = currentUser.id;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            // user for chat created
                profilelink = {
                    email: currentUser.email,
                    name: currentUser.firstName + ' ' + currentUser.lastName,
                    link: currentUser.id,
                    photoUrl: currentUser.photoUrl
                };

            firebase.database().ref('profile-link/' + user.uid).set(profilelink);

            initChatUI(currentUser);

        }).catch(function(err) {
            if(err.code === "auth/email-already-in-use")
                initChatUI(currentUser);
            else
                alert("firechat problem, " + err.code + ": " + err.message);
        });
    }
}


function updateProfileLink(b) {
    profileURL = b;
    // alert("in a funtion" + b);
}

function initChatUI(user) {

    var email = user.email;
    var password = user.id;
    var displayName = user.firstName + ' ' + user.lastName;     ///not using//  email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '); // fix string, replace all symbols w/ space
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(u) {
        // signed in
        chatUser = {
            uid: u.uid,
            email: email,
            displayName: displayName,
            link: user.id,
            photoUrl: user.photoUrl
        }

        firebase.database().ref('profile-link/' + u.uid).set(chatUser);

        // initChatUI(chatUser);

        // Get a reference to the Firebase Realtime Database
        var chatRef = firebase.database().ref();

        // Create an instance of Firechat
        var chatUI = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));

        // // If the user is logged in, set them as the Firechat user
        chatUI.setUser(chatUser.uid, chatUser.displayName);

        firebase.database().ref('profile-link/').on('value', function(snapshot) {
            updateProfileLink(snapshot.val());
        });

        // Get a reference to the Firebase Realtime Database
        // var chatRef = firebase.database().ref();
        var chat = new Firechat(chatRef);

        chat.setUser(chatUser.uid, chatUser.displayName);
        chat.getRoomList(function(roomList) {

            var valid = /^[0-9a-zA-Z ]+$/;

            var rooms = [];
            for( var cid in courses) {
                rooms.push(cid);
                for (var rid in roomList) {
                    if (roomList[rid].name === courses[cid].name) {
                        rooms.pop();
                        chat.enterRoom(rid);
                    }
                }
            }
            if( rooms.length > 0 ) {
                var names = "";
                for(var i = 0; i < rooms.length; i++) {
                    if( valid.test(courses[rooms[i]].name) ) {
                        names = names + "\n " + courses[rooms[i]].name;
                        chat.createRoom(courses[rooms[i]].name, "public"); //, function (roomId) {
                        // chat.enterRoom(roomId);
                        // alert("entering room : " + courses[rooms[i]].name);
                        // });
                    }
                }
            }
        });
        // sleep(2000);
        // $('#displayName').textContent = "Hi, " + chatUser.displayName;
        // $('#displayName').style.display = "block";
        // $('#displayName').style.backgroundColor = "#007e37";
        $.hideLoading();

    }).catch(function(err) {
        //Handle error here
        alert("firechat problem, " + err.code + ": " + err.message);
    });
}

function sleep(ms) {
    // return new Promise(resolve => setTimeout(resolve, ms));
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
}

/*
/////// code not use /////////////////////

// function $(id) {
// return document.querySelector(id);
// }

// $('#displayName').textContent = "Entering ...";
// $('#displayName').style.backgroundColor = "#ab9800"

// $('#displayName').style.display = "none";
// $('#logoutBtn').style.display = "none";
// $('#loginBtn').style.display = "block";

// chat.createRoom(courseName, "public", function(roomId){
//     chat.enterRoom(roomId);
//     console.log("OK"+roomId);
// });

// Listen for authentication state changes
// firebase.auth().onAuthStateChanged(function (user) {
//     // Once authenticated, instantiate Firechat with the logged in user
//     if (user) {
//         // // If the user is logged in, set them as the Firechat user
//     } else {
//         // If the user is not logged in,
//     }
// });
// function logout() {
//     firebase.auth().signOut().then(function() {
//         //sign-out successful
//         this.location.reload();
//     }).catch(function(err) {
//         console.log(err);
//     });
// }

// function loginGoogle() {
//     firebase.auth().signOut();  // sign out current user
//
//     // Log the user in via Google
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider).then(function (result) {
//         // User signed in!
//         // $('#loginBtn').style.display = "none";
//         // $('#logoutBtn').style.display = "block";
//
//         // var uid = result.user.id;
//         console.log(result);
//         initChat(result.user);
//
//     }).catch(function (error) {
//         console.log("Error authenticating user:", error);
//     });
// }
*/
