var __ = require("lodash");
var assert = require("assert");
var Promise = require("bluebird");
var protocols = require("../protocols");
var portbasefile = __dirname + "/portbase.json";

function error() {
    var args = ["[ERROR]", new Date()].concat([].slice.call(arguments));
    console.error.apply(console.error, args);
}

function info() {
    var args = ["[INFO]", new Date()].concat([].slice.call(arguments));
    console.info.apply(console.info, args);
}

var TypeRegistry = {
    serial: require("./serial"),
    vitual: require("./random")
};

function validateOutgoing(port) {
    return __.pick(port, "id", "name",  "type", "config", "display", "statis", "status", "protocols")
}

var sequencer = (function() {
    var seqs = {};
    return function(type) {
        return seqs[type] = (seqs[type]||0) + 1
    }
})();

// PortDatabase is like a "database" but for "Port"
function PortDatabase() {
    var ports = {};
    var loaded;
    var fs = require("fs");
    if (fs.existsSync(portbasefile)) {
        try {
            var json = require(portbasefile);
            //TODO load saved port file
            loaded = true;
        } catch (e) {
            error("Cannot load portbase from "+portbasefile);
        }
    }
    if (!loaded) {
        info("Loading ports from registry");
        for (var type in TypeRegistry) {
            loadType(type);
        }
    }

    function loadType(type) {
        Promise.resolve(TypeRegistry[type].load()).then(function(results) {
            __.each(results, function(port) {
                ports[type + sequencer(type)] = port;
            })
        }, function(err) {
            error("Cannot load port from registry '" + type + ".", err);
        })
    }

    function forPorts(portId, status) {
        var port = __.find(ports, {_id: portId});
        if (!port) {
            return Promise.reject("Not found")
        } else if (port.status !== status) {
            return Promise.reject("Conflict")
        } else {
            return Promise.resolve(port);
        }
    }

    this.list = function() {
        return ports;
    };
    this.get = function(portId) {
        return ports[portId];
    };
    this.start = function(portId) {
        return forPorts(portId, "inactive").then(function(port) {
            return TypeRegistry[type].open(port, buildDataCallback(port)).then(function(handle){
                port.$handle = handle;
                port.status = "active";
                return port;
            }).then(validateOutgoing)
        });
    };
    this.stop = function(portId) {
        return forPorts(portId, "active").then(function(port) {
            return TypeRegistry[type].close(port.$handle, port).then(function(){
                delete port.$handle;
                port.status = "inactive"
                return port;
            }).then(validateOutgoing)
        });
    };
    this.bind = function(portId, protocolId) {
        return forPorts(portId, "inactive").then(function(port) {
            port.protocols = __.without(port.protocols||[], protocolId).concat(protocolId);
            return port;
        }).then(validateOutgoing)
    };
    this.unbind = function(portId, protocolId) {
        return forPorts(portId, "inactive").then(function(port) {
            port.protocols = __.without(port.protocols||[], protocolId);
            return port;
        }).then(validateOutgoing)
    };
    this.listBinds = function(protocolId) {
        return __.filter(ports, function(p) {
            return p.protocols && p.protocols.indexOf(p) >= 0;
        }).map(validateOutgoing);
    }
}

function buildDataCallback(object) {
    var pp = __.map(object.protocols || [], function(proto) {
        return protocols.instantializ(proto);
    });
    return function (data) {
        object.statis.events++;
        for (var i=0;i<pp.length; i++) {
            pp[i](object.id, data)
        }
    }
}

module.exports = new PortDatabase();