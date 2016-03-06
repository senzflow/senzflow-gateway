var __ = require("lodash");
var EventEmitter = require("events").EventEmitter;
var utils = require("util");
var vm = require('vm');
var ports = require("../ports/index");

function portFunction(portId) {
    return ports.get(portId);
}

function Protocol(json) {
    this._json = json;
    EventEmitter.call(this);
}

utils.inherits(Protocol, EventEmitter);

Protocol.prototype.start = function() {
    var json = this._json;
    assert(typeof json.name === "string" && json.script);
    var statis = {events: 0};
    var context = new vm.createContext({
        port: portFunction
    });
    var script = new vm.Script(json.script);
    script.runInContext(context);
};

Protocol.prototype.stop = function() {

};

module.exports = Protocol;
