const tests = require("./testUserRequests");

const correctUser = {
    "chats": [],
    "tweets": [],
    "_id": "6031e426a267a82678924fc6",
    "username": "_test",
    "password": "$2a$10$H.flz9OlYnrheW66E7hguu5aaRkxNthYq/PoI6/nBN8Pa2wzl14km",
    "__v": 0
}

test("Good login request", () => {
    tests.loginTest({username: "_test", password: "password"})
    .then( data => {
        expect(data.username).toBe(correctUser.username);
    })
    .catch( err => expect(err).toBe(correctUser))
})

test("Invalid login request", () => {
    tests.loginTest({username: "_test", password: "badpass"})
    .then( data => {
        expect(data).toBe("Request failed with status code 401");
    })
    .catch( err => expect(err.message).toBe("Request failed with status code 401"));
})

test("Logout", () => {
    tests.logout()
        .then( response => expect(response.data).toBe("logged out"));
})

test("Successful Register", () => {
    tests.register({username: "uniqueName", password: "password"})
        .then( response => {
            const created = !!response.data.username
            expect(created).toBe(true);
        })
})

test("Fail Register", () => {
    tests.register({username: "uniqueName", password: "password"})
    .then( response => console.log(response))
    .catch( err => expect(err.message).toBe("Request failed with status code 400"))
})



tests.deleteTestUser();