"use strict";

const __ = require("lodash");
const settings = require("./settings");
const nodered = require("./nodered");
const device = require("./device");
const auth = require("./auth");
const systatus = require("./systatus");
const {createSocketServer} = require("./utils/websocket");

function start() {

    const service = require("./express").prepareService();
    
    const sockServer = createSocketServer(service.httpServer);

    nodered.initialize(service.httpServer, device.getContext(), service.app);

    nodered.installRoute(service.app);
    device.installRoute(service.app);
    settings.installRoute(service.app);
    auth.installRoute(service.app);
    systatus.installSocket(sockServer);

    service.startService({});
}

module.exports = {
    start: start
};