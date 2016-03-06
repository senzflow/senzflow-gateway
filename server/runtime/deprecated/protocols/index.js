var __ = require("lodash");
var Promise = require("bluebird");
var assert = require("assert");
var Protocol = require('./protocol');

function Protocols() {

    var protocols = [new Protocol({
        id: "debug",
        display: "调试协议 - 把数据输出到log",
        script: "ports(\"*\").data(function(data) {log(data)})"
    })];

    this.list = function(options) {
        return protocols;
    };

    this.get = function(id) {
        return __.find(protocols, {id: id})
    };

    this.create = function(data) {
        var id = options.id;
        assert(id);
        var p = __.find(protocols, {id: id});
        if (p) {
            throw new Error("Protocol " + id + " exists")
        }
        protocols.push(__.assign(__.pick(data, "id", "display"), {statis: {events: 0}}));
        return protocols;
    };

    this.delete = function(protocolId) {
        __.remove(protocols, {id: protocolId});
    };

    this.instantializ = function(protoId) {
        var proto = __.find(protocols, {id: protoId});
        if (proto) {
            var onData = proto.onData;
            if (typeof onData === "string") {
                var vm = require('vm');
                var context = new vm.createContext({});  //TODO put sdk in context
                var script = new vm.Script(options.onData);
                onData = function(port, data) {
                    context.port = port;
                    context.data = data;
                    context.debug = debug;
                    script.runInContext(context);
                }
            }
            assert(typeof onData === 'function');
            return function(port, data) {
                proto.statis.events++;
                onData(port, data)
            };
        }
    }
}

module.exports = new Protocols();