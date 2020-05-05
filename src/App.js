import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home.js";
import Dashboard from "./components/Dashboard.js";
import Composer from "./components/Composer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OrgSignup from "./components/OrgSignup";
import Admin from "./components/Admin";
import OrgJoin from "./components/OrgJoin";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/get-started" component={OrgSignup} />
        <Route path="/:orgName/admin" component={Admin} />

        <Route path="/:orgName/dashboard" component={Dashboard} />
        <Route path="/:orgName/compose" component={Composer} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route path="/join" component={OrgJoin} />
      </Switch>
    </Router>
  );
}

export default App;
