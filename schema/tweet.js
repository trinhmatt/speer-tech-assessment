const   mongoose = require("mongoose"),
        Schema = mongoose.Schema;

module.exports.tweetSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "users"},
    body: String,
    createdAt: Date
})

