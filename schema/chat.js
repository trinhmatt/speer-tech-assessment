const   mongoose = require("mongoose"),
        Schema = mongoose.Schema;

module.exports.chatSchema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: "users"}],
    messages: [
        {
            user: String,
            createdAt: Date,
            bodyText: String
        }

    ]
})
