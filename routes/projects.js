var express = require("express");
var router = express.Router();
var Project = require("../models/project");
var Message = require("../models/message");
var User = require("../models/user");
var middleware = require("../middleware");

// INDEX - show all projects
router.get("/", middleware.isLoggedIn, function(req, res) {
  // Get all projects from DB
  Project.find({}, function(err, projects) {
    if(err) {
      console.log(err);
    } else {
      User.findById(req.user._id).populate("projects").exec(function(err, user) {
        if(err) {
          console.log(err);
        } else {
          console.log(user);
          res.render("projects/index", {projects: projects, user: user.projects});
        }
      });
    }
  });
});

// CREATE - add new project to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // Create a new project and save to the DB
  Project.create(
    {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    }, function(err, project) {
      if(err) {
        console.log(err);
      } else {
        var existInInviteList = false;
        var emailsToInvite = req.body.invitations.split(',');
        emailsToInvite.forEach(function(email) {
          User.findOne({email: email}, function(err, user) {
            if(err || user === null) {
              console.log(err);
            } else {
              //project.users.push(user);
              //project.save();
              if(!user._id.equals(req.user._id)){
              console.log("sssssssssssssssssssssssssssssssssss");
              console.log(user._id);
              console.log(req.user._id);
              console.log(existInInviteList);
              console.log("sssssssssssssssssssssssssssssssssss");

              user.projects.push(project);
              user.save();
            }
            }
          });
        });

          console.log("asdasd8amaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas");
          User.findById(req.user._id, function(err, user) {
            if(err || user === null) {
              console.log(err);
            } else {
              user.projects.push(project);
              user.save();
              console.log(user);
            }
          });
        console.log(project);
        // redirect back to projects page
        res.redirect("/projects");
      }
    }
  );
});

// NEW - show form to create new project
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("projects/new");
});

// SHOW - shows more info about one project
router.get("/:id", middleware.isLoggedIn, function(req, res) {
  // find the project with the provided ID
  // render show template with that project
  Project.findById(req.params.id).populate("messages").populate("users").exec(function(err, project) {
    if(err) {
      console.log(err);
    } else {
      // render show template with that project
      User.find({}, function(err, users) {
        if(err) {
          console.log(err);
        } else {
          var names = [];
          console.log(users);
          users.forEach(function(user) {
            var found = false;
            user.projects.forEach(function(project) {
              if(project.equals(req.params.id)) {
                found = true;
              }
            });
            if(found)
              names.push(user.username);
          });
          console.log(names);
          res.render("projects/show", {project: project, users: names});
        }
      });
    }
  });
});

// EDIT PROJECT ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    res.render("projects/edit", {project: project});
  });
});

router.get("/:id/invite", middleware.checkProjectOwnership, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    res.render("projects/invite", {project: project});
  });
});

// UPDATE PROJECT ROUTE
router.put("/:id", middleware.checkProjectOwnership, function(req, res) {
  Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, project) {
    if(err) {
      res.redirect("/projects");
    } else {
      res.redirect("/projects/" + project._id);
    }
  });
});



// Invite Users ROUTE
router.put("/:id/invite", middleware.checkProjectOwnership, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if(err) {
      res.redirect("/projects");
    } else {
      var emailsToInvite = req.body.invitations.split(',');
      emailsToInvite.forEach(function(email) {
        User.findOne({email: email}, function(err, user) {
          if(err || user === null) {
            console.log(err);
          } else {
            //project.users.push(user);
            //project.save();
            user.projects.push(project);
            user.save();
          }
        });
      });
      res.redirect("/projects/" + project._id);
    }
  });
});

// DESTROY PROJECT ROUTE
router.delete("/:id", middleware.checkProjectOwnership, function(req, res) {
  Project.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/projects");
    } else {
      res.redirect("/projects");
    }
  });
});

module.exports = router;
