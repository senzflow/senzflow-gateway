
function promisifyAjax(ajax) {
    return new Promise(function(resolve, reject) {
        ajax.done(resolve).fail((response) => {
            if (response.status == 200) { // in case of DELETE, a 200 OK response may result in 'fail' ??
                resolve();
            } else {
                var err = response.responseJSON, t;
                if (!err) {
                    try {
                        err = JSON.parse(response.responseText) || {};
                    } catch (e) {
                        err = {error: "unknown", message: ""};
                    }
                }
                err.statusCode = response.status;
                err.statusText = response.statusText;
                !err.error && (err.error = "unknown");
                !err.message && (err.message = "Error: " + err.statusCode + " " + err.statusText);
                reject(err);
            }
        });
    })
}

export function restGet(url) {
    return promisifyAjax($.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json'
    }));
}

export function restPost(url, data) {
    return promisifyAjax($.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        processData: false,
        data: typeof data === 'string' ? data : JSON.stringify(data || {})
    }));
}

export class Resource {
    constructor(url) {
        this._url = url;
        this._cache = {};
        this._loaded = false;
    }
    create(data) {
        return restPost(this._url, data)
    }
    load() {
        if (this._loaded) {
            return Promise.resolve(false);
        }
        var that = this;
        return restGet(this._url).then(function(rs) {
            _.each(rs, function(r) {
                that._cache[r.id] = r;
            });
            that._loaded = true;
            return true;
        })
    }
    list() {
        return _.values(this._cache);
    }
    get(id) {
        return this._cache[id];
    }
    refresh(id) {
        //TODO
    }
    update(id, data) {
        return restPost(this._url + id, data).then(function(u) {
            return this._cache[id] = u;
        }.bind(this))
    }
}

export function createSocket(path, query, protocol) {
    let loc = window.location;
    let proto = /^\w+\:\/\/.+/.test(path) ? "" : `${loc.protocol === "https:" ? "wss":"ws"}://${loc.host}`;
    let queryString = $.param(query||{}, true);

    let client = new WebSocket(`${proto}${path}?${queryString}`, protocol||"default");
    return new Promise((resolve, reject) => {
        client.onerror = err => {
            reject(err);
        };
        client.onopen = () => {
            resolve(client);
        };
        /*
         client.close();
         client.onclose = () => console.log("socket closed", arguments);
         client.onmessage = (e) => {
         console.log("get message", e.data);
         this.trigger("message", [e.data])
         };*/
    });
}
