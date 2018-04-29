var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var session = require('express-session')
const fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary');


var index = require('./routes/index');
var users = require('./routes/users');
const uploadSchedule = require('./routes/uploadSchedule');
var cors = require('cors');

var app = express();

app.use((cors()));

//firebase config
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyAEIzM5eQ_mQALQwEPTPyS694HBuqFX87I",
    authDomain: "seniorproject-403c1.firebaseapp.com",
    databaseURL: "https://seniorproject-403c1.firebaseio.com",
    projectId: "seniorproject-403c1",
    storageBucket: "seniorproject-403c1.appspot.com",
    messagingSenderId: "344709537348"
};
firebase.initializeApp(config);

var database = firebase.database()

firebase.auth().onAuthStateChanged(function(user){
  if (user){
    console.log("user logged in")
  } else {
    console.log('not logged in')
  }
})

cloudinary.config({
    cloud_name: 'dbq9jhgoi',
    api_key: '582619634618989',
    api_secret: 'qoYzUbBo4geKi12lOtmP9d1IpVA'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
  secret: 'kciqlciqplsgvnzxcmq,a;',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))


app.use('/', index);
app.use('/users', users);
app.use('/upload/', uploadSchedule);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handling
app.use(function(req, res, next) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // res.json({
    //     error: {
    //         message: err.message
    //     }
    // });
    var error = ({
        message: err.message,
        status: err.status
    })
    res.render('error', ({error: error}))
});

module.exports = app;
