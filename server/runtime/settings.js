"use strict";

const __ = require("lodash");
const Promise = require("bluebird");
const storage = require("./utils/storage");
const validate = require("./utils/validate");
const device = require("./device");
const systatus = require("./systatus");
const logger = require("./utils/logger");

let runtimeSettings = {};
let permanentSettings = {};

+function initialize() {
    storage.load().then(data => {
        logger.debug("loaded settings", data);
        data = data || {};
        permanentSettings = data || {};
        runtimeSettings = __.assign({}, permanentSettings);
        return device.applySettings(permanentSettings).then(() => {
            systatus.publishStatus("profile", "permanent");
        });
    }).catch(err => {
        logger.error(err);
        systatus.publishStatus("profile", "none");
        systatus.publishLogs(`error initialize device: ${err.message||err}`);
    });
}();

function readRuntimeSettings() {
    return Promise.resolve(__.assign({}, runtimeSettings));
}

function readPermanentSettings() {
    return Promise.resolve(__.assign({}, permanentSettings));
}

function saveRuntimeSettings(newSettings) {
    let validated = validate(newSettings, runtimeSettings);
    if (!__.isEmpty(validated)) {
        let updated = __.assign({}, runtimeSettings, validated);
        return device.applySettings(updated).then(() => {
            runtimeSettings = updated;
            systatus.publishStatus("profile", "runtime");
        });
    }
    return readRuntimeSettings();
}

function flushRuntimeSettings() {
    let settings = __.assign({}, permanentSettings, runtimeSettings);
    return storage.save(settings).then(() => {
        permanentSettings = settings;
    });
}

function resetRuntimeSettings() {
    __.assign(runtimeSettings, permanentSettings);
    return Promise.resolve();
}

function installRoute(router) {
    router.get("/api/settings/runtime", (req, res, next) => {
        readRuntimeSettings().then(s => res.send(s), next);
    });
    router.post("/api/settings/runtime", (req, res, next) => {
        saveRuntimeSettings(req.body).then(s => res.send({}), next);
    });
    router.post("/api/settings/runtime/flush", (req, res, next) => {
        flushRuntimeSettings().then(s => res.send({}), next);
    });
    router.post("/api/settings/runtime/reset", (req, res, next) => {
        resetRuntimeSettings().then(s => res.send({}), next);
    });

    router.get("/api/settings/permanent", (req, res, next) => {
        readPermanentSettings().then(s => res.send(s), next);
    });

    router.post("/api/reboot", (req, res, next) => {
        res.send({});
        setTimeout(() => {
            logger.info("rebooting...");
            process.exit(1);
        }, 1000)
    });
}

module.exports = {
    installRoute: installRoute,
    readSettings: readRuntimeSettings,
    saveSettings: saveRuntimeSettings
};
