"use strict";

const __ = require("lodash");
const logger = require("./utils/logger");

const props = {
    uptime: new Date()  //none, runtime or permanent
};

let conns = [];


function installSocket(sockServer) {
    sockServer("/api/systatus", "*", function(conn) { // input args: connection, resourceURL.query, {token: token}
        conns.push(conn);
        conn.send(JSON.stringify({props: props}));
        conn.on('close', () => {conns = __.without(conns, conn)});
        conn.on('error', (err) => {conn.close(); conns = __.without(conns, conn)});
        conn.on('message', function(data,flags) {});
    })
}

function broadcast(object) {
    let data = JSON.stringify(object);
    for (let i=0, N=conns.length; i<N; i++) {
        conns[i].send(data)
    }
}

function publishStatus(name, value) {
    logger.debug("publish status", name, value);
    props[name] = value;
    broadcast({props: props});
}

function publishLogs(log) {
    broadcast({logs: log});
}

module.exports = {
    installSocket: installSocket,
    publishStatus: publishStatus,
    publishLogs: publishLogs
};
