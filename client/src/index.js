require('bootstrap-loader');
require("./styles/style.scss");

import React from "react"
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import createHistory from 'history/lib/createBrowserHistory'

import store from "./store"
import {HomeComponent}      from "./components/home.jsx";
import {ApplicationComponent} from "./components/application.jsx";
import {LoginComponent}     from "./components/login.jsx";
import {DashboardComponent} from "./components/dashboard.jsx";
import {FlowAdminComponent} from "./components/flow.jsx";
import {BootComponent, RebootingComponent}     from "./components/boot.jsx";
import {SystemComponent}     from "./components/system.jsx";
import {SetupComponent}     from "./components/setup.jsx";
import {AboutComponent}     from "./components/about.jsx";
import {PlaceHolder,NotFound} from "./components/common.jsx";
import {InitializeSystatus}   from "./actions/systatus.js";

if (!window.assert) {
    window.assert = function(e, m) {
        let message = `assert failure: ${m}`
        if (!e) {
            console.error(message);
            throw new Error(message);
        }
    }
}
function requireAuth(nextState, replace) {
    if (!store.of("session", "token")) {
        replace({ nextPathname: nextState.location.pathname }, '/login')
    }
}

function startApp() {
    render(<Router history={createHistory()}>
        <Route path="/" component={HomeComponent}>
            <IndexRoute component={DashboardComponent}></IndexRoute>
            <Route path="login" component={LoginComponent}/>
            <Route path="about" component={AboutComponent}/>
            <Route path="rebooting" component={RebootingComponent}/>
            <Route path="a" onEnter={requireAuth} component={ApplicationComponent}>
                <Route path="boot" component={BootComponent}/>
                <Route path="system" component={SystemComponent}/>
                <Route path="setup" component={SetupComponent}/>
                <Route path="flow" component={FlowAdminComponent}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>, document.getElementById('app'));

    InitializeSystatus();
}

export default $(document).ready(startApp);
