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
import Nav from "./components/Nav";
import OrgCreate from "./components/OrgCreate";
import { StateProvider } from "./store.js";

function App() {
  return (
    <StateProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />

          <Route path="/get-started" component={OrgSignup} />
          <Route path="/:orgName/admin" component={Admin} />

          <Route path="/:orgName/dashboard">
            <Nav />
            <Dashboard />
          </Route>

          <Route path="/:orgName/compose">
            <Nav />
            <Composer />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />

          <Route path="/join" component={OrgJoin} />
          <Route path="/create" component={OrgCreate} />
        </Switch>
      </Router>
    </StateProvider>
  );
}

export default App;
