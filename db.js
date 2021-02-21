const mongoose = require("mongoose"),
    dotenv = require("dotenv").config(),
    bcrypt = require("bcryptjs"),
    userSchema = require("./schema/user"),
    chatSchema = require("./schema/chat"),
    tweetSchema = require("./schema/tweet");

//Remove deprecated flags
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

let User,
    Chat,
    Tweet;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.DB_CONNECTION_STRING);

        db.on("error", (err) => {
            reject(err);
        })

        db.once("open", () => {
            User = db.model("users", userSchema.userSchema);
            Chat = db.model("chats", chatSchema.chatSchema);
            Tweet = db.model("tweets", tweetSchema.tweetSchema);

            console.log("Db running")
            resolve();
        })
    })
}


//USER AUTH FUNCTIONS
module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {

        let errObj = {};

        //Hash the password 
        bcrypt.genSalt(10, (err, salt) => {

            if (err) {
                errObj.status = 500;
                errObj.err = err;
                reject(errObj)
            } else {
                bcrypt.hash(userData.password, salt, (err, hash) => {

                    //Fail to hash
                    if (err) {
                        errObj.status = 500;
                        errObj.err = err;
                        reject(errObj);
                    } else {

                        userData.password = hash;
                        let newUser = new User(userData);

                        newUser.save((err) => {

                            //Username already exists
                            if (err) { 
                                errObj.status = 400;
                                errObj.err = err;
                                reject(errObj);
                            } else {
                                resolve(newUser);
                            }
                        })
                    }
                })
            }
        })
    })
}

module.exports.login = (user) => {
    return new Promise( (resolve, reject) => {

        //Find user if they exist
        User.findOne({ username: user.username }).exec()
            .then( (foundUser) => {
  
              //Compare the hashed password with the password supplied
              bcrypt.compare(user.password, foundUser.password)
                .then( (response) => {
                  if (response) {
                    resolve(foundUser);
                  } else {
                    reject();
                  }
                })
  
            })
            .catch( (err) => {
              reject("No user found");
            })
  
    })
}

module.exports.deleteTestUser = () => {
    return new Promise( (resolve, reject) => {
        User.deleteOne({username: "uniqueName"}, (err) => {
            !err ? resolve("deleted") : reject(err);
        })
    })
}

//CHAT FUNCTIONS
module.exports.createChat = (chatData) => {
    for (let i = 0; i < chatData.users; i++) {
        chatData.users[i] = mongoose.Types.ObjectId(chatData.users[i]);
    }
    return new Promise( (resolve, reject) => {
        const chat = new Chat(chatData);
        chat.save( (err) => {
            if (err) {
                reject(err);
            } else {
                let saveState = true;
                console.log(chat);
                for (let i = 0; i < chat.users.length; i++) {
                    console.log(chat.users[i]);
                    User.findById(mongoose.Types.ObjectId(chat.users[i]), (err, foundUser) => {
                        if (!err) {
                            foundUser.chats.push(chat._id);
                            foundUser.save( (err) => {
                                if (err) {
                                    saveState = false;
                                }
                            })
                        }
                    })
                }

                if (saveState) {
                    resolve(chat);
                } else {
                    reject("Unable to save chat");
                }

            }
        })
    })
}

module.exports.sendChat = (chatID, body) => {
    body.createdAt = new Date();
    return new Promise( (resolve, reject) => {
        Chat.findById(mongoose.Types.ObjectId(chatID), (err, foundChat) => {
            if (!err) {
                foundChat.messages.push(body);
                foundChat.save( (err) => {
                    if (!err) {
                        resolve(foundChat);
                    } else {
                        reject(err);
                    }
                })
            } else {
                reject(err);
            }
        })
    })
}

//TWEET FUNCTIONS
module.exports.createTweet = (tweetData) => {
    tweetData.author = mongoose.Types.ObjectId(tweetData.author);

    //Ideally the date would be sent from the client for most accurate dates,
    //I create it here since I'm not sure how to do it using Postman
    tweetData.createdAt = new Date(); 

    return new Promise( (resolve, reject) => {

        User.findById(tweetData.author, (err, foundUser) => {
            if (!err) {

                const newTweet = new Tweet(tweetData);
                newTweet.save( err => {
                    if (!err) {

                        foundUser.tweets.push(newTweet);
                        foundUser.save( err => {
                            !err ? resolve("success") : reject(err);
                        });

                    } else {
                        reject(err);
                    }
                })

            } else {
                reject(err);
            }
        })
        
    })
}

module.exports.getAllTweets = (userId) => {
    return new Promise((resolve, reject) => {

        User.findById(mongoose.Types.ObjectId(userId)).populate("tweets").exec()
            .then((user) => {
                resolve(user.tweets);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports.getTweet = (tweetId) => {
    return new Promise( (resolve, reject) => {
        Tweet.findById(mongoose.Types.ObjectId(tweetId))
            .then( tweet => resolve(tweet))
            .catch( err => reject(err));
    })
}

module.exports.updateTweet = (tweetId, editData) => {
    const editDate = new Date();
    return new Promise( (resolve, reject) => {
        Tweet.findByIdAndUpdate(
            mongoose.Types.ObjectId(tweetId), 
            {body: editData.body, createdAt: editDate},
            {new : true},
            (err, editedTweet) => {
                !err ? resolve(editedTweet) : reject(err);
            })
    })
}