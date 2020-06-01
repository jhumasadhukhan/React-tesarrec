import React, { Component } from "react";

import Layout from "./hoc/Layout/Layout";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import About from "./containers/About/About";
import Reference from "./containers/Reference/Reference";
import Mes from "./containers/Process/Mes/Mes";
import Mfc from "./containers/Process/Mfc/Mfc";
import Dynamic from "./containers/Process/Dynamics/Dynamic";
import {
  BrowserView,
  MobileView,

} from "react-device-detect";

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/dynamic" exact component={Dynamic} />

        <Route path="/process/mfc" exact component={Mfc} />
        <Route path="/process/mes" exact component={Mes} />
        <Route path="/reference" component={Reference} />
        <Route path="/" exact component={About} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <div>
        <BrowserView>
          <Layout>{routes}</Layout>
        </BrowserView>
        <MobileView>
          <p> go on pc for it to work</p>
        </MobileView>
      </div>
    );
  }
}

export default withRouter(App);
