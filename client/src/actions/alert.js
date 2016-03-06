import {restGet, restPost} from "./resource.js"
import factory from "./factory"

const path = "alerts";

export var Dismiss = factory(function(alert, oldState) {
    console.log("dismiss", alert, oldState);
    return _.without(oldState, alert);
}, path);

export var Alerting = factory(function(alert, err, oldState) {
    let arr = oldState||[];
    arr.push({title: alert, message: err && err.message});
    return arr;
}, path);
