"use strict";

function Store() {

    const _state = {};
    const _lsnrs = [];
    const _errors = [];

    const self = this;

    function pathArray(path) {
        assert(typeof path === "string");
        return path.split(".");
    }

    this.reset = function() {
        Object.keys(_state).forEach(key => trigger(null, key))
    };

    this.dispatch = function(path, state) {
        if (state.then) {
            state.then(data => trigger(data, path));
        } else {
            trigger(state, path);
        }
        return state;
    };
    
    this.of = function(path) {
        let array = pathArray(path);
        let final = array.pop();
        let state = _state;
        if (array.length > 0) {
            state = array.reduce((last, p) => last != undefined ? last[p] : undefined, state);
        }
        if (state !== undefined) {
            return _.isArray(final) ? _.pick(state, final) : state[final];
        }
    };

    this.listen = function(listener, path) {
        assert(typeof path === "string");
        _lsnrs.push({lsnr: listener, path: path});
        return this;
    };

    this.unlisten = function(listener) {
        let lsnrs = _lsnrs;
        for (var i=0, N = lsnrs.length; i<N; i++) {
            if (lsnrs[i].lsnr === listener) {
                lsnrs.splice(i, 1);
                break
            }
        }
        return this;
    };

    this.update = function(data, path) {
        trigger(data, path);
    };

    function trigger(change, path) {
        if (change !== undefined) { // undefined is treated as NO CHNAGE
            let array = pathArray(path);
            if (array.length > 0) {
                let object = _state;
                let final = array.pop();
                for (var i = 0, N = array.length; i<N; i++) {
                    object = object[array[i]] || (object[array[i]] = {})
                }
                if (change === null) {  // null is treated as DELETE THE KEY
                    delete(object[final])
                } else {
                    object[final] = change;
                }
            }
            let lsnrs = _lsnrs;
            for (var i=0, N = lsnrs.length; i<N; i++) {
                let lsnrobj = lsnrs[i];
                lsnrobj.lsnr(self.of(lsnrobj.path))
            }
        }
    }
}

export default new Store();
