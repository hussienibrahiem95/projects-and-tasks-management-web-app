var express = require("express");
var router = express.Router({mergeParams: true});
var Project = require("../models/project");
var Message = require("../models/message");
var middleware = require("../middleware");

// messages new
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if(err) {
      console.log(err);
    } else {
      res.render("messages/new", {project: project});
    }
  });
});

// messages create
router.post("/", middleware.isLoggedIn, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if(err) {
      console.log(err);
    } else {
      Message.create({text:req.body.message}, function(err, message) {
        if(err) {
          console.log(err);
        } else {
          // add username and id to message
          message.author.id = req.user._id;
          message.author.username = req.user.username;
          // save message
          message.save();
          project.messages.push(message);
          project.save();
          console.log("DONE");
          res.redirect("/projects/" + req.params.id);
        }
      });
    }
  });
});


module.exports = router;
