var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var routes = require('./routes');
var analytics = require('./routes/analytics');
var users = require('./routes/user');

var app = express();

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
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/dashboard', routes.dashboard);
app.get('/settings', routes.settings);

app.get('/page-analytics/usages', analytics.usages);
app.post('/page-analytics/record', analytics.record);
app.post('/page-analytics/getavgtime', analytics.getavgtime);
app.get('/page-analytics/getrequestct', analytics.getrequestct);
app.post('/page-analytics/getrequests', analytics.getrequests);

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

console.log(chalk.black.bgBlue.bold("Listening for requests at 3000"));
app.listen(3000);

module.exports = app;
