var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var parseArgs = require('minimist');
var config = require('./config');
var mongoose = require('mongoose');
var routes = require('./routes');
var analytics = require('./routes/analytics');

mongoose.connect(config.mongodb.connectionString);

var app = express();

var argv = parseArgs(process.argv.slice(2));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Configure passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
var authHelper = require('./passport/auth_helper');

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/dashboard', routes.dashboard);
app.get('/settings', routes.settings);

app.get('/page-analytics/usages', authHelper.isAuthenticated, analytics.usages);
app.post('/page-analytics/record', analytics.record);
app.post('/page-analytics/getavgtime', authHelper.isAuthenticated, analytics.getavgtime);
app.get('/page-analytics/getrequestct', authHelper.isAuthenticated, analytics.getrequestct);
app.post('/page-analytics/getrequests', authHelper.isAuthenticated, analytics.getrequests);
app.post('/page-analytics/remove-all', authHelper.isAuthenticated, analytics.removeAll);
app.post('/page-analytics/getbrowsershares', authHelper.isAuthenticated, analytics.getbrowsershares);
app.get('/page-analytics/export-all', authHelper.isAuthenticated, analytics.exportAll);

var routes = require('./routes/auth')(passport);
app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log(chalk.black.bgBlue.bold("Listening for requests at " + (argv.port || 3000)));
app.listen(argv.port || 3000);

module.exports = app;
