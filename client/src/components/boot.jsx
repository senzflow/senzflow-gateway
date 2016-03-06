import React from "react"
import {Component} from "./base.jsx";
import store from "../store";
import {restPost} from "../actions/resource";

export class RebootingComponent extends Component {
    componentDidMount() {
        setTimeout(() => this.context.history.push("/"), 3000)
    }
    render() {
        return <div><h3>Rebooting...</h3></div>
    }
}

export class BootComponent extends Component {
    componentDidMount() {
        this.connect("systatus");
    }
    render() {
        let systatus = store.of("systatus")||{};
        let reboot = e => {
            store.reset();
            restPost("/api/reboot");
            this.context.history.push("/rebooting");
        };
        return <div>

            <form className="form form-horizontal">

                <h3>运行时参数</h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        状态
                    </label>
                    <div className="col-sm-10">
                        <div className="label label-danger">已修改</div>
                        <button type="button" className="btn btn-info btn-lg">保存</button>
                    </div>
                </div>

                <h3>永久参数</h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        状态
                    </label>
                    <div className="col-sm-10">
                        <small>{systatus.profile}</small>
                    </div>
                </div>

                <h3>启动</h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label">
                        操作
                    </label>
                    <div className="col-sm-10">
                        <button type="button" className="btn btn-info btn-lg" onClick={reboot}>重启</button>
                    </div>
                </div>
            </form>
        </div>
    }
}

RebootingComponent.contextTypes = {
    history: React.PropTypes.object
};

BootComponent.contextTypes = {
    history: React.PropTypes.object
};
