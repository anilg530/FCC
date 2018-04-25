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

function $(id) {
    return document.querySelector(id);
}

function init() {
    //var currentUser = <%= JSON.stringify(user) %>;
    $('#displayName').textContent = "Loading chat ...";
    // $('#displayName').style.display = "none";
    // $('#logoutBtn').style.display = "none";
    // $('#loginBtn').style.display = "block";

    if(currentUser.id != null) {
        // alert(JSON.stringify(session) );
        var email = currentUser.email;
        var password = currentUser.id;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            // user for chat created
            loginChat(currentUser);
        }).catch(function(err) {
            if(err.code === "auth/email-already-in-use")
                loginChat(currentUser);
            else
                alert(err.code + ": " + err.message);
        });
    }
}

function loginChat(user) {

    var email = user.email;
    var password = user.id;
    var displayName = user.firstName + ' ' + user.lastName;     ///not using//  email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '); // fix string, replace all symbols w/ space
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
        // signed in
        chatUser = {
            uid: result.uid,
            email: email,
            displayName: displayName
        }
        initChatUI(chatUser);
    }).catch(function(err) {
        //Handle error here
        alert(err.code + ": " + err.message);
    });
}



function initChatUI(chatUser) {

    $('#displayName').textContent = "Hi, " + chatUser.displayName;
    $('#displayName').style.display = "block";
    $('#displayName').style.backgroundColor = "#007e37"

    // Get a reference to the Firebase Realtime Database
    var chatRef = firebase.database().ref();

    // Create an instance of Firechat
    var chatUI = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));

    // // If the user is logged in, set them as the Firechat user
    chatUI.setUser(chatUser.uid, chatUser.displayName);

    //var courseTitle = courses;
// alert(courses);
    var chat = new Firechat(chatRef);
    chat.setUser(chatUser.uid, chatUser.displayName);
    chat.getRoomList(function(roomList) {
        // console.log(roomList);
        var rooms = [];
        for( var id in roomList) {
            for (var i=0; i < courses.length; i++) {
                // alert(course);
                if(roomList[id].name === courses[i]) {
                    rooms.push(roomList[id]);
                    chat.enterRoom(id);
                }
            }
        }
        if( rooms.length == 0 ) {
            for(var i=0; i < courses.length; i++) {
                // alert(course);
                chat.createRoom(courses[i], "public", function(roomId) {
                    chat.enterRoom(roomId);
                });
            }
        }
    });

    // chat.createRoom(courseName, "public", function(roomId){
    //     chat.enterRoom(roomId);
    //     console.log("OK"+roomId);
    // });



}



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
