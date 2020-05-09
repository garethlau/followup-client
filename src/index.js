import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./index.css";
import axios from "axios";
import { getAccessToken } from "./accessToken";
import { StateProvider } from "./store.js";

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
    }
    console.log(config);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
