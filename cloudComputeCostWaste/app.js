var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const passportConfig = require('./passportConfig');

var uri = 'mongodb+srv://root:test@cluster0-jmmfm.mongodb.net/test?retryWrites=true';
mongoose.connect(uri);

var db = mongoose.connection;
var app = express();

//routes
var index = require('./routes/index');
var api = require('./routes/api');
var viewProfile = require('./routes/viewProfile');
var viewData = require('./routes/viewData');
var downloadProbe = require('./routes/downloadProbe');
var probePost = require('./routes/probePost');
var updateProviders = require('./routes/updateProviders');
var createImage = require('./routes/createImage');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));

passportConfig(app);

app.use('/', index);
app.use('/api', api);
app.use('/viewProfile', viewProfile);
app.use('/viewData', viewData);
app.use('/downloadProbe', downloadProbe);
app.use('/probePost', probePost);
app.use('/updateProviders', updateProviders);
app.use('/createImage', createImage);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
