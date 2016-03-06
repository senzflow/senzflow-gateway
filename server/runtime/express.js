"use strict";

const logger = require("./utils/logger");

function prepareService() {
    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var app = express();
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.resolve(__dirname, '../static')));

    let httpServer = require('http').createServer(app);

    return {
        httpServer: httpServer,
        app: app,
        startService: startService.bind(null, httpServer, app)
    };
}

function startService(httpServer, app, appRouters) {
    const INDEXFILE = require("path").resolve(__dirname, "../views/index.html");

    var secureToken = Math.random().toString(36).substr(2).toUpperCase();
    logger.debug("login token", secureToken);

    for (let path in appRouters) {
        app.use(path, appRouters[path]);
    }

    app.use("/nodered", function(req, res, next) {
        res.status(500);
        res.send({error: "nodered not work"});
    });

    app.use("/api", function(req, res, next) {
        logger.error("Unknown request (404):", req.url);
        res.status(404);
        res.send({error: `"${req.url}" is not defined`});
    });

    app.use(function (req, res, next) {
        res.sendFile(INDEXFILE);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            logger.error("[api-error]", err.stack, err);
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        logger.error("[api-error]", err.stack, err);
        res.send({
            message: err.message,
            error: {}
        });
    });



    function authenticate(token, fn) {
        if (token === secureToken) {
            fn(null, token);
        } else {
            fn(new Error("Access denied"))
        }
    }

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    httpServer.listen(9090, function() {
        logger.debug('Express server listening on port ' + httpServer.address().port);
    });

}

module.exports = {
    prepareService: prepareService
};
