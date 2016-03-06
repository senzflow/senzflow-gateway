"use strict";

// the embedded NODERED engine

const RED = require("node-red");
const RED_ADMIN_ROOT = "/nodered/admin";
const RED_NODE_ROOT = "/nodered/node";

function restrict(req, res, next) {
    if (req.session.token) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}


function initialize(server, context, app) {
    RED.init(server, {
        httpAdminRoot: RED_ADMIN_ROOT,
        httpNodeRoot: RED_NODE_ROOT,
        //userDir: nconf.get("userdir"),
        nodesDir: require("path").resolve(__dirname, "../nodes"),
        verbose: true, //nconf.get("verbose"),
        //flowFile: nconf.get("flow") || require("yargs").argv._[0],
        functionGlobalContext: context
    });

    // Serve the editor UI from /red
    app.use(RED_ADMIN_ROOT, RED.httpAdmin);
    // Serve the http nodes UI from /api
    app.use(RED_NODE_ROOT, RED.httpNode);
    RED.start();

}

function installRoute(router) {

    //router.use("/nodered/admin", RED.httpAdmin);

    router.post("/api/nodered/start", (req, res, next) => {
        RED.start();
        res.send({});
    });
    router.post("/api/nodered/stop", (req, res, next) => {
        RED.stop();
        res.send({});
    })
}

module.exports = {
    initialize: initialize,
    installRoute:installRoute
};
