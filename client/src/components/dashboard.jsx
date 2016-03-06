import React from "react"
import {Component} from "./base.jsx";
import store from "../store";

let iotworkbench = require('../assets/iotworkbench.png');

export class DashboardComponent extends Component {
    componentDidMount() {
        this.connect("systatus")
    }

    render() {
        let {props, logs} = store.of("systatus")||{};
        return <div>
            <div className="page-header">
                <h1>WebStart <small>©senzflow</small></h1>
                <img src={iotworkbench} alt="iot workbench"/>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <h3>状态</h3>
                    {props && <pre>{JSON.stringify(props, null, "  ")}</pre>}
                </div>
                <div className="col-sm-6">
                    <h3>日志</h3>
                    <ul className="list-group">{
                        (logs||[]).map((log,key) =>
                            <li className="list-group-item" key={key}>{
                                JSON.stringify(log,null,"  ")
                            }</li>)
                    }</ul>
                </div>
            </div>
        </div>
    }
}
