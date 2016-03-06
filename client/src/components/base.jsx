import React from "react"
import store from "../store"
const ERROR = new Object;
const LOADING = new Object;

export class Component extends React.Component {
    constructor(props) {
        super(props);
        this._meta = {}
    }
    render() {
        let {model, error} = this.state || {};
        if (!model) {
            if (error) {
                return <div>Error! {JSON.stringify(error)}</div>
            } else {
                return <div>Loading ...</div>
            }
        }
        return this.$render(model);
    }

    $render(model) {
        return <div>OverrideME!</div>
    }

    componentWillUnmount() {
        this.disconnect()
    }

    connect(actionOrPath) {
        let path = actionOrPath.path ||actionOrPath;
        let action = typeof actionOrPath === "function" && actionOrPath;
        this.disconnect();
        let meta = this._meta;
        let lsnr = data => this.setState({model: data});
        meta.lsnr = lsnr;
        meta.wait = true;
        store.listen(lsnr, path);
        if (action) {
            action();
        }
        return this;
    }

    dispatch(action) {
        return store.dispatch(action)
    }

    disconnect() {
        let meta = this._meta;
        let {lsnr} = meta;
        if (lsnr) {
            store.unlisten(lsnr)
            delete meta.lsnr
        }
    }

    getModel() {
        return this.state.model;
    }
}
