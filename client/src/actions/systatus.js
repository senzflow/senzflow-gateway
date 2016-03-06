import {createSocket} from "./resource.js"
import store from "../store"

const path = "systatus";

let tracingSocket;

export function InitializeSystatus() {
    let token = store.of("session.token");
    if (tracingSocket == null) {
        token && trace(token);
        store.listen(authListener, "session", "token");
    }
}

export function UpdateSystatus(name, value) {
    return merge({[name]: value});
}

function merge(partial) {
    return store.update(_.extend({}, store.of(path), partial), path);
}

const authListener = function() {
    let token = store.of("session", "token");
    if (!!token) {
        if (!tracingSocket) {
            trace(token);
        }
    } else {
        if (tracingSocket) {
            console.log("stop trace systatus");
            tracingSocket.close();
            tracingSocket = undefined;
            store.update({}, path);
        }
    }
};

function trace(token) {
    createSocket("/api/systatus", {access_token: token}).then(socket => {
        if (tracingSocket) {
            tracingSocket.close();
        }
        tracingSocket = socket;
        socket.onclose = () => console.log("socket closed", arguments);
        socket.onmessage = (e) => merge(JSON.parse(e.data))
    })
}
