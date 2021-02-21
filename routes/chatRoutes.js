const   express = require("express"),
        router = express.Router(),
        passport = require("passport"),
        db = require("../db");

router.post("/new-chat", (req, res) => {

    let users = [];

    for (key in req.body) {
        if (req.body[key].length === 24) { //24 = length of mongo object id
            users.push(req.body[key]);
        }
    }

    if (users.length === 2) {

        const chatData = {
            users, 
            messages: []
        }

        db.createChat(chatData)
        .then( (newChat) => {
            res.send(newChat);
        })
        .catch( err => res.status(500).send(err));

    } else {
        res.status(400).send("invalid parameters");
    }

})

router.post("/send-chat/:chatID", (req, res) => {
    db.sendChat(req.params.chatID, req.body)
    .then( (response) => {
        res.send(response);
    })
    .catch( err => {
        res.status(500).send(err);
    })
})



module.exports = router;