var express = require('express');
var router = express.Router();
var authHelper = require('../passport/auth_helper');

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/login', function(req, res) {
	console.log('Request for /login');
    // Display the Login page with any flash message, if any
    res.render('login', { message: req.flash('message') });
  });
 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/page-analytics/usages',
    failureRedirect: '/',
    failureFlash : true 
  }));
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/page-analytics/usages',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  router.get('/signout', function(req, res) {
	  req.logout();
	  res.redirect('/');
  });
 
  return router;
}
