import {restGet, restPost} from "./resource.js"
import factory from "./factory"

const path = "session";

export var Login = factory(function(accesscode) {
    return restPost(`/api/login`, {accesscode: accesscode})
}, path);

export var Logout = factory(function() {
    return restPost(`/api/logout`).then(() => null)
}, path);
