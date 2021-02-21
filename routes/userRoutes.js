const   express = require("express"),
        router = express.Router(),
        passport = require("passport"),
        db = require("../db");


router.post("/login", passport.authenticate('local'), (req, res) => {
    if (!!req.user) {
        res.send(req.user);
    } else {
        res.status(400).send("Invalid Login");
    }
})

router.get("/test", (req, res) => {
    console.log(req.user);
})

router.get("/logout", (req, res) => {
    req.logout();
    res.send("logged out");
})

router.post("/register", (req, res) => {
    let userInfo = req.body;
    let userCheck = true;

    if (!!userInfo.username && userInfo.username.length > 0) {
        userInfo.username = userInfo.username.trim();
    } else {
        userCheck = false;
    }

    if (!!userInfo.password && userInfo.password.length > 0) {
        userInfo.password = userInfo.password.trim();
    } else {
        userCheck = false;
    }

    if (userCheck) {

        userInfo.chats = [];
        userInfo.tweets = [];

        db.registerUser(userInfo).then( (user) => {
            res.send(user);
        }).catch( err => {
            res.status(err.status).send(err.err);
        })
    }
    
})

router.get("/delete-test", (req, res) => {
    db.deleteTestUser().then( response => res.send(response))
        .catch( err => res.send(err));
})

module.exports = router;