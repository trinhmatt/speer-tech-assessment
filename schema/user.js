const   mongoose = require("mongoose"),
        Schema = mongoose.Schema;

module.exports.userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    chats: [{type: Schema.Types.ObjectId, ref: "chats"}],
    tweets: [{type: Schema.Types.ObjectId, ref: "tweets"}]
});