var express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    Project        = require("./models/project"),
    Message        = require("./models/message"),
    User           = require("./models/user"),
    app            = express();

var server         = require("http").createServer(app),
    io             = require("socket.io").listen(server);


// requiring routes
var projectRoutes    = require("./routes/projects"),
    indexRoutes      = require("./routes/index"),
    messageRoutes    = require("./routes/messages");

var url = process.env.DATABASEURL || "mongodb://localhost/project_chatting_db";

// connecting to the DB
mongoose.connect(url);

//require moment
app.locals.moment = require('moment');

// body-parser config
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Mohamed Salah is the best player in the world!!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//pass in path to view
app.use(function(req, res, next) {
  res.locals.current_path = req.path;
  next();
});

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/messages", messageRoutes);

users = [];
connections = [];

server.listen(process.env.PORT || 3000, function() {
  console.log("Server is listining....");
});

io.sockets.on("connection", function(socket) {
  connections.push(socket);

  console.log("Connected: %s sockets connected", connections.length);
  socket.on("disconnect", function() {
    // Disconnect
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);

  });

  // Send message
  socket.on("send message", function(data) {
    console.log(data);
    io.sockets.emit("new message", data);
  });

});
