var __ = require("lodash");
var utils = require("util");
var PortBase = require("./base");

function load() {
    return [new RandomPort({
        name: "random",
        display: "随机数虚拟端口",
        config: {interval: 3000},
        status: "inactive"
    })]
}

function create(json) {
    return new RandomPort(json)
}

function RandomPort(json) {
    PortBase.call(this, json);
}

utils.inherits(RandomPort, PortBase);

RandomPort.prototype._open = function() {
    var that = this;
    var interval = this.configOf("interval", 1000);
    return Promise.resolve(setTimeout(function() {
        that.emitEvent("event", Math.random());
    }, interval));
};

RandomPort.prototype._close = function(handle) {
    return Promise.resolve(clearTimeout(handle));
};

module.exports = {load: load, create: create};
