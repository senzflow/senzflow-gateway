"use strict";

const __ = require("lodash");

function STRING(field, value) {
    if (typeof value !== "string") {
        throw new Error(field + " should be a string")
    }
    return value;
}

var validators = {
    url: STRING,
    clientId: STRING,
    deviceType: STRING, name: STRING, label: STRING, ca: STRING, key: STRING, cert: STRING
};

function validate(settings, existSettings) {
    var validated = {};
    for (var field in settings) {
        const validator = validators[field];
        if (!validator) {
            throw new Error("Unknown setting \"" + field + "\"")
        }
        let value = validator(field, settings[field]);
        if (!__.isEqual(value, existSettings[field])) {
            validated[field] = value;
        }
    }
    return validated;
}

module.exports = validate;
