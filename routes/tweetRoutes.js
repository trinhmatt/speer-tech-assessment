const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware/middleware"),
        db = require("../db");


router.post("/send-tweet", middleware.isLoggedIn, (req, res) => {
    db.createTweet(req.body)
        .then( response => res.send(response))
        .catch( err => res.status(500).send(err));
})

router.put("/edit-tweet/:id", middleware.isLoggedIn, (req, res) => {
    db.updateTweet(req.params.id, req.body)
        .then( (response) => res.send(response))
        .catch( err => res.status(500).send(err));
})

router.delete("/delete-tweet/:id", middleware.isLoggedIn, (req, res) => {
    db.deleteTweet(req.params.id)
        .then( response => res.send(response))
        .catch( err => res.status(500).send(err));
})


module.exports = router;