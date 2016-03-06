var __ = require("lodash");
var EventEmitter = require("events").EventEmitter;
var utils = require("util");

function PortBase(json) {
    this._json = json;
    EventEmitter.call(this);
}

utils.inherits(PortBase, EventEmitter);

PortBase.prototype.open = function() {
    var json = this._json;
    var that = this;
    return this._open(json).then(function(handle) {
        json.status = "active";
        that._handle = handle;
    });
};

PortBase.prototype.close = function() {
    var json = this._json;
    var that = this;
    return this._close(this._handle).then(function() {
        json.status = "inactive";
        delete that._handle;
    });
};

PortBase.prototype._open = function() {throw "OVERRIDEME!"};

PortBase.prototype._close = function() {throw "OVERRIDEME!"};

PortBase.prototype.jsonify = function(ext) {
    return __.assign({}, this._json, ext);
};

PortBase.prototype.configOf = function(name) {
    return this._json[name] || arguments[1]
};

PortBase.prototype.emitEvent = function(event) {
    //TODO stats
    return this.emit("event", event);
};

module.exports = PortBase
