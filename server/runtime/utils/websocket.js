"use strict";

// https://github.com/websockets/ws

const Promise = require("bluebird");
const logger = require("./logger");

function createSocketServer(server) {
    const ws = require("ws");

    return function mountWebSocket(path, protocol, handler) {

        const wsServer = new ws.Server({
            server:server,
            path:path,
            perMessageDeflate: false
        });

        wsServer.on('connection',(ws) => handler(ws)); //TODO auth

        wsServer.on('error', function(err) {
            logger.error(path, err);
        });
    };
}

module.exports = {
    createSocketServer: createSocketServer
};
