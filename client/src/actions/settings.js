import {restGet, restPost} from "./resource.js"
import {Alerting} from "./alert.js"
import {UpdateSystatus} from "./systatus.js"
import factory from "./factory"

const path = "settings.runtime";

export var LoadRuntimeSettings = factory(function(refresh, oldState) {
    if (oldState && refresh === false) {
        return oldState;
    }
    let pro = restGet(`/api/settings/runtime`);
    pro.then(() => UpdateSystatus({runtimeDirty: false}));
    return pro;
}, path);

export var UpdateRuntimeSettings = factory(function(prop, value, oldState) {
    (oldState = oldState || {})[prop] = value;
    UpdateSystatus({runtimeDirty: true});
    return oldState
}, path);

export var SaveRuntimeSettings = factory(function(changed) {
    let pro = restPost(`/api/settings/runtime`, changed)
        .then(() => changed);
    pro.then(() => {
        UpdateSystatus({flashDirty: true, runtimeDirty: false});
        Alerting("设置已经应用到网关 (未写入永久存储)");
    }, err => Alerting("未能应用设置", err));
    return pro;
}, path);

export var FlushRuntimeSettings = factory(function(changed) {
    return restPost(`/api/settings/runtime`, changed)
        .then(() => restPost(`/api/settings/runtime/flush`, changed))
        .then(() => {
            UpdateSystatus({runtimeDirty: false, flashDirty: false});
            Alerting("设置已经写入永久存储.");
        }, err => Alerting("未能写入永久存储", err))
        .then(() => changed)
}, path);
