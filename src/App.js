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

import axios from "axios";
import { BASE_URL } from "./constants";
import { setAccessToken } from "./accessToken";
import { store, actions } from "./store";

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
          console.log(res.data);
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
    return <div>Loading...</div>;
  }

  return (
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
  );
}

export default App;
