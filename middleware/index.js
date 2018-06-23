var Project = require("../models/project");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}

middlewareObj.checkProjectOwnership = function (req, res, next) {
  if(req.isAuthenticated()) {
    Project.findById(req.params.id, function(err, project) {
      if(err) {
        req.flash("error", "Project not found!");
        res.redirect("back");
      } else {
        if(project.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
