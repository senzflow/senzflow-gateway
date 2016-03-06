"use strict";

const Device = require("senzflow-sdk.js").Device;
const systatus = require("./systatus");
const logger = require("./utils/logger");

let runningDevice = undefined;

// the device context used by NODERED nodes
const context = {
    publishEvent: function(options, callback) {
        if (!runningDevice) {
            callback("device not ready");
        } else {
            runningDevice.publishEvent(options, callback);
        }
    },
    publishStatus: function(options, callback) {
        if (!runningDevice) {
            callback("device not ready");
        } else {
            runningDevice.publishStatus(options, callback);
        }
    },
    subscribeEvent: function(options, handler, ref) {
        if (!runningDevice) {
            throw new Error("device not ready");
        }
        let sub = {
            handler: function(event) {
                if (true) { //TODO filter eventType/deviceType etc...
                    handler(event)
                }
            }
        };
        let topic = options.eventType + "/" + (options.deviceType||"");
        (subscriptions[topic]||(subscriptions[topic] = {}))[ref] = sub;
        runningDevice.subscribeEvent(options);
        runningDevice.on("event", sub.handler)
    },
    unsubscribeEvent: function(options, ref) {
        if (runningDevice) {
            let topic = options.eventType + "/" + (options.deviceType||"");
            var sub = subscriptions[topic];
            if (sub) {
                if (sub[ref]) {
                    runningDevice.removeListener('message',sub[ref].handler);
                    delete sub[ref];
                }
                if (Object.keys(sub).length == 0) {
                    delete subscriptions[topic];
                    runningDevice.unsubscribe(options);
                }
            }
        }
    }
};

let subscriptions = {};

function validateSettings(settings) {
    let {url, clientId, deviceType, name, label, ca, key, cert} = settings;
    if (clientId && deviceType && url) {
        return true;
    }
    return false;
}


function applySettings(settings) {
    if (!validateSettings(settings)) {
        return Promise.reject("invalid settings");
    }
    let {url, clientId, deviceType, name, label, ca, key, cert} = settings;
    var secureMode = ca && key && cert;
    return new Promise((resolve, reject) => {
        logger.debug("connecting senzflow", url, clientId);
        let newDevice = new Device(url, {
            clientId: clientId,
            ca: ca,
            key: key,
            cert: cert,
            protocol: secureMode ? 'mqtts' : 'mqtt',
            initialLoad: false,
            deviceType: "simtype",
            rejectUnauthorized: !!settings.rejectUnauthorized,
            about: {name: name, label: label},
            onConfig: onConfig,
            onControl: onControl
        });
        let publishStatus = (status) => {
            if (!runningDevice || runningDevice === newDevice) {
                systatus.publishStatus("deviceStatus", status)
            }
        };
        let onError = (error) => {
            logger.error(url, error);
            publishStatus(`error: ${error.message||error}`);
            reject(error)
        };
        newDevice.once("error", onError);
        newDevice.on("error", err => logger.error(err));
        newDevice.once("connect", function() {
            newDevice.removeListener("error", onError);
            if (runningDevice) {
                runningDevice.close(true);
                subscriptions = {}
            }
            runningDevice = newDevice;
            publishStatus("connected");
            logger.debug("device connected");
            resolve();
        });
        newDevice.once("close", () => {
            logger.debug("closing device");
            publishStatus("closed");
            if (runningDevice !== newDevice) {
                newDevice.close(false);
            }
        });
        //newDevice.on("event", dispatch);
    });
}

function onConfig() {
    logger.debug("Apply config:", arguments);
    return "Granted by 'simulator'";
}

function onControl() {
    logger.debug("Apply control:", arguments);
    return "Granted by 'simulator'";
}

function installRoute(router) {
}

function getContext() {
    return context;
}

module.exports = {
    installRoute: installRoute,
    applySettings: applySettings,
    getContext: getContext
};
