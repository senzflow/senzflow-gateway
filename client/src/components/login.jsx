import {Component} from "./base.jsx";
import React from "react";
import ReactMixin from "react-mixin";
import LinkedStateMixin from "react-addons-linked-state-mixin"
import {Login, Logout} from "../actions/login.js"

export class LoginComponent extends Component {

    constructor() {
        super();
        this.state = {accesscode: ""};
    }

    login(e) {
        e.preventDefault();
        Login(this.state.accesscode).then(() => {
            this.context.history.push(this._t() || "/");
        }, err => {
            console.error("login error", err);
            this.setState({error: err})
        });
    }

    _t() {
        return (this.context.location.state||{}).nextPathname;
    }

    componentDidMount() {
        this.connect("session")
    }

    render() {
        let session = this.state.model;
        let error = this.state.error;
        let target = this._t();
        return (
            <div>
                <h3>{target ? "需要输入访问码才能继续当前操作" : "输入访问码"}</h3>
                {error && <div>{error}</div>}
                <form role="form">
                    <div className="form-group">
                        <input type="password" valueLink={this.linkState('accesscode')} placeholder="Access Code"/>
                    </div>
                    <button type="submit" onClick={this.login.bind(this)}>Submit</button>
                </form>
            </div>
        );
    }
}

ReactMixin(LoginComponent.prototype, LinkedStateMixin);

LoginComponent.contextTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object
};