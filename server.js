const express = require("express"),
      bodyParser = require("body-parser"),
      cors = require("cors"),
      path = require("path"),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      session = require("express-session"),
      dotenv = require("dotenv").config(),
      db = require("./db.js"),
      app = express();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const tweetRoutes = require("./routes/tweetRoutes");

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));

//Enable cross origin
app.use(cors());

//User authentication
app.use(session({
    secret: "twit", 
    resave: false,
    saveUninitialized: false
    }));

app.use(passport.initialize());
app.use(passport.session());

//Use custom strategy to authenticate user credentials
passport.use(new LocalStrategy( (username, password, done) => {
    const user = { username, password };
    db.login(user)
      .then( (foundUser) => {
        return done(null, foundUser);
      })
      .catch( (err) => {
        console.log(err);
        return done(null, false, { message: err});
      })
}));
  
//Serialize user data into session cookies
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(userRoutes);
app.use(chatRoutes);
app.use(tweetRoutes);

db.initialize().then( () => {
    app.listen(HTTP_PORT, () => {
        console.log("Server running on port: ", HTTP_PORT);
    })
})