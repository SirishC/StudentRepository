var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var addProjRouter = require('./routes/addProj');
var homeRouter = require('./routes/home');
var searchProjRouter = require('./routes/searchProj');
var myProjRouter = require('./routes/myProj');

var app = express();

// view engine setu p
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Connnect to Mongo DB
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    //we're conected
    console.log("We're connected!");
});

//Use sessions for tracking users on specfic pages
app.use(session({
    secret: 'sirish',
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: db
    })

}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/home/addproj', addProjRouter);
app.use('/home/searchproj', searchProjRouter);
app.use('/home/myproj', myProjRouter);
app.use('/home', homeRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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

app.listen(process.env.port | 3000);

console.log("Listening on port 3000...");

module.exports = app;