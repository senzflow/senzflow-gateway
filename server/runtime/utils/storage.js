"use strict";

const Promise = require("bluebird");
const STORAGE = require("path").resolve(__dirname, "../../../.senzflow.json");

function Storage(location) {
    this.load = function() {
        try {
            return Promise.resolve(require(location));
        } catch (e) {
            return Promise.reject(e);
        }
    };
    this.save = function(data) {
        try {
            require("fs").writeFileSync(location, JSON.stringify(data));
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

module.exports = new Storage(STORAGE)