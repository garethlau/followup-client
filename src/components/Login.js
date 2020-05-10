import React, { useContext, useState } from "react";
import { InputGroup, Button, Intent, Tooltip } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { store, actions } from "../store";
import { setAccessToken } from "../accessToken";
import utils from "../utils";
import { AppToaster } from "../toaster";

export default function Login() {
  const { dispatch } = useContext(store);

  const username = useFormInput("");
  const password = useFormInput("");
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    let redirect = null;
    try {
      const search = utils.searchToJSON(history.location.search);
      redirect = search.redirect || "/create";
    } catch {
      redirect = "/create";
    }

    let data = {
      username: username.value,
      password: password.value,
    };
    try {
      let result = await axios.post(BASE_URL + "/api/v1/auth/login", data, {
        withCredentials: true,
      });
      const { accessToken, user } = result.data;
      if (accessToken) {
        setAccessToken(accessToken);
        dispatch({ type: actions.SET_USER, payload: user });
        history.push(redirect);
      } else {
        console.log("Invalid login");
      }
    } catch (err) {
      console.log(err.message);
      if (err.response) {
        console.log(err.response.status);
        if (err.response.status === 404) {
          AppToaster.show({
            message: "User does not exist.",
            intent: Intent.DANGER,
          });
        } else if (err.response.status === 401) {
          AppToaster.show({
            message: "Incorrect password.",
            intent: Intent.DANGER,
          });
        } else {
          AppToaster.show({
            message: "There was an error. Please try again.",
            intent: Intent.DANGER,
          });
        }
      }
    }
  }

  function goSignup() {
    if (history.location.search) {
      const search = utils.searchToJSON(history.location.search);
      let redirect = search.redirect;
      history.push(`/signup?redirect=${redirect}`);
    } else {
      history.push("/signup");
    }
  }
  function handleLockClick() {
    setShowPassword(!showPassword);
  }

  const lockButton = (
    <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal={true}
        onClick={handleLockClick}
      />
    </Tooltip>
  );

  return (
    <div>
      <div
        style={{
          width: "550px",
          height: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "30px",
        }}
      >
        <h1>Log in</h1>
        <InputGroup
          style={{ marginBottom: "20px" }}
          placeholder="Username"
          value={username.value}
          onChange={username.onChange}
        />
        <InputGroup
          style={{ marginBottom: "20px" }}
          placeholder="Password"
          value={password.value}
          onChange={password.onChange}
          rightElement={lockButton}
          type={showPassword ? "text" : "password"}
        />
        <div style={{ textAlign: "right" }}>
          <Button
            style={{ marginRight: "10px" }}
            text="Sign up"
            onClick={goSignup}
          />
          <Button text="Log in" onClick={login} intent={Intent.PRIMARY} />
        </div>
      </div>
    </div>
  );
}
