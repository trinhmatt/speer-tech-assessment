const   axios = require("axios"),
        qs = require("qs");
const { resolve } = require("path");

let userTests = {};

userTests.loginTest = (userData) => {
    return new Promise( (resolve, reject) => {
        axios.post("http://localhost:8080/login", qs.stringify(userData))
        .then( (response) => {
            resolve(response.data);
        })
        .catch( (err) => {
            reject(err);
        })
    })
}

userTests.logout = () => {
    return new Promise( (resolve, reject) => {
        axios.get("http://localhost:8080/logout")
            .then( response => resolve(response))
            .catch( err => reject(err));
    })
}

userTests.deleteTestUser = () => {
    axios.get("http://localhost:8080/delete-test");
}

userTests.register = (userData) => {
    return new Promise( (resolve, reject) => {
        axios.post("http://localhost:8080/register", qs.stringify(userData))
            .then( (response) => resolve(response.data))
            .catch( err => reject(err));
    })
}

module.exports = userTests;