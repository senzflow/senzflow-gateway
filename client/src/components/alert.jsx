import React from "react"
import {Component} from "./base.jsx"
import {Dismiss} from "../actions/alert"


class Alert extends Component {
    render() {
        let alert = this.props.alert;
        let dismiss = e => {
            e.preventDefault();
            Dismiss(alert);
        };
        let {title, message} = alert;
        return <div className="alert alert-warning alert-dismissible" role="alert">
            <button type="button" className="close" aria-label="Close" onClick={dismiss}>
                <span aria-hidden="true">&times;</span>
            </button>
            <strong>{title}</strong> {message && <small>({message})</small>}
        </div>
    }
}

export class Alerts extends Component {
    componentDidMount() {
        this.connect("alerts");
    }

    render() {
        let alerts = (this.state||{}).model;
        return <div>{_.map(alerts||[], (alert,key) => <Alert alert={alert} key={key}></Alert>)}</div>
    }
}