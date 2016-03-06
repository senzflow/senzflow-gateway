import React from "react"
import {LoadRuntimeSettings, UpdateRuntimeSettings, SaveRuntimeSettings, FlushRuntimeSettings} from "../actions/settings.js"
import {Component} from "./base.jsx";

class SetupCredential extends Component {
    componentDidMount() {
        this.connect(LoadRuntimeSettings);
    }

    $render(model) {
        let {ca, cert, key} = model;
        let applyChange = (key) => e => {
            e.preventDefault();
            UpdateRuntimeSettings(key, e.target.value);
        };
        return <form className="form-horizontal">
            <div className="form-group">
                <label htmlFor="inputCa" className="col-sm-2 control-label">CA证书</label>
                <div className="col-sm-8">
                    <textarea className="form-control" rows="3" id="inputCa"
                              value={ca || " "}
                              onChange={applyChange("ca")}></textarea>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="inputCert" className="col-sm-2 control-label">设备证书</label>
                <div className="col-sm-8">
                    <textarea className="form-control" rows="3" id="inputCert"
                              value={cert || " "}
                              onChange={applyChange("cert")}></textarea>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="inputKey" className="col-sm-2 control-label">设备私钥</label>
                <div className="col-sm-8">
                            <textarea className="form-control" rows="3" id="inputKey"
                                      value={key || " "}
                                      onChange={applyChange("key")}></textarea>
                </div>
            </div>
        </form>
    }
}

export class SetupProtocol extends Component {
    componentDidMount() {
        this.connect(LoadRuntimeSettings);
    }

    $render(model) {
        let {clientId, url, deviceType} = model;
        let applyChange = (key) => e => {
            e.preventDefault();
            UpdateRuntimeSettings(key, e.target.value);
        };
        return <form className="form-horizontal">
            <div className="form-group">
                <label htmlFor="inputClientId" className="col-sm-2 control-label">设备ID</label>
                <div className="col-sm-8">
                    <input className="form-control" id="inputClientId"
                              value={clientId || " "}
                              onChange={applyChange("clientId")}></input>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="inputDeviceType" className="col-sm-2 control-label">设备类型</label>
                <div className="col-sm-8">
                    <input className="form-control" id="inputDeviceType"
                              value={deviceType || " "}
                              onChange={applyChange("deviceType")}></input>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="inputUrl" className="col-sm-2 control-label">URL</label>
                <div className="col-sm-8">
                    <input className="form-control" rows="3" id="inputUrl"
                              value={url || " "}
                              onChange={applyChange("url")}></input>
                </div>
            </div>
        </form>
    }
}

export class SetupComponent extends Component {
    componentDidMount() {
        this.connect(LoadRuntimeSettings);
    }
    $render(model) {
        let applyChanges = (e) => {
            e.preventDefault();
            SaveRuntimeSettings(model);
        };
        let applyPersistChanges = (e) => {
            e.preventDefault();
            FlushRuntimeSettings(model);
        };
        return <div>
            <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" className="active">
                    <a href="#protocol" aria-controls="protocol" role="tab"
                       data-toggle="tab">基本参数</a></li>
                <li role="presentation">
                    <a href="#config" aria-controls="config" role="tab"
                       data-toggle="tab">安全连接</a></li>
            </ul>
            <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="protocol">
                    <SetupProtocol></SetupProtocol>
                </div>
                <div role="tabpanel" className="tab-pane" id="config">
                    <SetupCredential></SetupCredential>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-8">
                    <div className="btn-toolbar">
                        <button className="btn btn-default" onClick={applyChanges}>应用</button>
                        <button className="btn btn-warning" onClick={applyPersistChanges}>应用并保存</button>
                    </div>
                </div>
            </div>
        </div>
    }
}
