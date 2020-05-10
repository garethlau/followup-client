import React, { useState, useEffect, useContext } from "react";
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
import Product from "./components/Product";
import StatelessNav from "./components/StatelessNav";

import axios from "axios";
import { BASE_URL } from "./constants";
import { setAccessToken } from "./accessToken";
import { store, actions } from "./store";

import { Spinner, Intent, Button } from "@blueprintjs/core";

function App() {
  const { dispatch } = useContext(store);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(`${BASE_URL}/api/v1/auth/refresh-token`, null, {
        withCredentials: true,
      })
      .then((res) => {
        const { accessToken, user } = res.data;
        if (accessToken && user) {
          setAccessToken(accessToken);
          dispatch({ type: actions.SET_USER, payload: user });
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const REFRESH_TIME = 10 * 60 * 1000; // Ten Minutes
    const interval = setInterval(() => {
      axios
        .post(`${BASE_URL}/api/v1/auth/refresh-token`, null, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data && res.data.accessToken) {
            setAccessToken(res.data.accessToken);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, REFRESH_TIME);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "min-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spinner intent={Intent.NONE} />
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <StatelessNav />
          <Home />
        </Route>
        <Route path="/product">
          <StatelessNav />
          <Product />
        </Route>
        <Route path="/get-started">
          <StatelessNav />
          <OrgSignup />
        </Route>
        <Route path="/:orgName/admin">
          <Nav />
          <Admin />
        </Route>
        <Route path="/join">
          <Nav />
          <OrgJoin />
        </Route>
        <Route path="/create">
          <Nav />
          <OrgCreate />
        </Route>
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
      </Switch>
    </Router>
  );
}

export default App;
