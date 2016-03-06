import React from "react"
import {Component} from "./base.jsx";
import {PlaceHolder} from "./common.jsx";

class StatusComponent extends Component {
    componentDidMount() {
        this.connect("status");
    }
    render() {
        var model = this.state||{};
        return <div></div>
    }
}

export class ApplicationComponent extends Component {
    render(model) {
        return <div>
            {this.props.children}
            <footer className="footer">
                <StatusComponent></StatusComponent>
            </footer>
        </div>
    }
}
