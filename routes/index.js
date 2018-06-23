var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function(req, res) {
  res.redirect("/login");
});

// show register form
router.get("/register", function(req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          req.flash("error", err.message);
          return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Project Chatting " + user.username);
           res.redirect("/projects");
        });
    });
});


// show login form
router.get("/login", function(req, res) {
  if(req.isAuthenticated()) {
    res.redirect("/projects")
  }
  else {
    res.render("login");
  }
});

// handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/projects",
  failureRedirect: "/login"
}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/projects");
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
