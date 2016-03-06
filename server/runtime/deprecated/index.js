var Promise = require("bluebird");
var __ = require("lodash");
var express = require('express');
var router = express.Router();
var ports = require("./ports");
var protocols = require("./protocols");

function wrap(promisify) {
    return function(req, res, next) {
        return Promise.resolve(promisify()).then(function(records) {
            res.send(records);
        }, next);
    }
}

function jsonify(port, id) {
    return port.jsonify({id: id});
}

router.get("/api/ports", function(req, res, next) {
    res.send(__.map(ports.list(), jsonify))
});

router.get("/api/protocols", wrap(__.bind(protocols.list, protocols)));

router.get("/api/port/:id", function(req, res, next) {
    var id = req.params.id;
    var port = ports.get(id);
    if (port === undefined) {
        res.sendStatus(404)
    } else {
        res.send(jsonify(port, id))
    }
});

router.post("/api/port/:id/start", function(req, res, next) {
    var id = req.params.id;
    var port = ports.get(id);
    if (port === undefined) {
        res.sendStatus(404)
    } else {
        port.open().then(function() {
            res.send(jsonify(port, id));
        }, function(err) {
            next(err);
        })
    }
});

router.post("/api/port/:id/stop", function(req, res, next) {
    var id = req.params.id;
    var port = ports.get(id);
    if (port === undefined) {
        res.sendStatus(404)
    } else {
        port.close().then(function() {
            res.send(jsonify(port, id));
        }, function(err) {
            next(err);
        })
    }
});

router.get("/api/protocols/:id", function(req, res, next) {
    var r = protocols.get(req.params.id);
    if (r === undefined) {
        res.sendStatus(404)
    } else {
        res.send(r)
    }
});

router.use("/api", function(req, res) {
    res.sendStatus(404);
});

module.exports = router;