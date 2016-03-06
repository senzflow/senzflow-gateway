var __ = require("lodash");
var Promise = require("bluebird");
var assert = require("assert");
var utils = require("util");
var PortBase = require("./base");

var DEFAULT_CONFIG = {baudRate: 115200, parity: "none", stopBits: 1, dataBits: 8, flowControl: "none"};

function load() {
    return new Promise(function(resolve, reject) {
        require("serialport").list(function (err, results) {
            if (err) {
                console.error("[ERROR] list serial port", err);
                reject(err);
            } else {
                resolve(__.map(results, function(p) {
                    return new SerialPort({
                        name: p["comName"],
                        display: "串口",
                        config: DEFAULT_CONFIG,
                        status: "inactive"
                    })
                }));
            }
        });
    });
}

function create(json) {
    return new SerialPort(json)
}

function SerialPort(json) {
    PortBase.call(this, json);
}

utils.inherits(SerialPort, PortBase);

SerialPort.prototype._open = function(json) {
    var that = this;
    return new Promise(function(resolve, reject) {
        var Driver = require("serialport").SerialPort;
        return new Driver(json.name, json.config)
            .on("open", function() {
                that.emit("open");
                that._handle.removeListener("error", reject);
                json.status = "active";
                resolve()
            })
            .on('data', function(d) {
                that.emit("event", d)
            })
            .once("error", reject)
            .on("error", function(e) {
                that.emit("error", e)
            });
    });
};

SerialPort.prototype._close = function(handle) {
    return Promise.resolve(handle.close());
};

module.exports = {
    load: load,
    create: create
};