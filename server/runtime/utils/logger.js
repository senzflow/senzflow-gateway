"use strict";

let bunyan = require('bunyan');
let options = {
    name: 'senzflow',
    level: "debug",
    serializers: {
        req: reqSerializer
    }
};

let level;
if (process.env.NODE_ENV === 'production') {
    level = "warn"
} else {
    options.src = true;
    level = "debug"
}

let logger = bunyan.createLogger(options);

function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        //headers: req.headers
    };
}

if (level !== options.level) {
    setTimeout(function() {
        logger.levels(0, level);
        logger[level]("adjust log level to", level);
    }, 30000)
}

module.exports = logger;
