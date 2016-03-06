import React from "react"
import {Component} from "./base.jsx";
import {Alerts} from "./alert.jsx";
import { Link } from 'react-router'
import {Logout} from "../actions/login.js"

export class HomeComponent extends Component {

    componentDidMount() {
        this.connect("session")
    }

    render() {
        let isLoggedin = !!((this.state||{}).model||{}).token;
        let logout = (e) => {
            e.preventDefault();
            Logout().then(() => this.context.history.push('/'))
        };
        return <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
                <div className="row">
                    <nav className="navbar navbar-default navbar-static-top navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed"
                                        data-toggle="collapse"
                                        data-target="#bs-example-navbar-collapse-1"
                                        aria-expanded="false">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <Link to="/"><span className="navbar-brand">WebStart</span></Link>
                            </div>
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav">
                                    <li><Link to="/a/setup">云端设置</Link></li>
                                    <li><Link to="/a/flow">事件流</Link></li>
                                    <li><Link to="/a/boot">启动</Link></li>
                                    <li><Link to="/about">关于</Link></li>
                                    <li>{
                                        isLoggedin ? <a className="btn" onClick={logout}>退出</a> :
                                            <Link to="/login">登录</Link>
                                    }</li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <Alerts></Alerts>
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}


HomeComponent.contextTypes = {
    history: React.PropTypes.object
};