"use strict";

const Promise = require("bluebird");

function installRoute(router) {
    router.post("/api/login", (req, res, next) => {
        res.send({token: "SOMETOKEN..."});
    });
    router.post("/api/logout", (req, res, next) => {
        res.send({});
    })
}

function validateToken(token) {
    return Promise.resolve({});
}

module.exports = {
    installRoute: installRoute,
    validateToken: validateToken
};
