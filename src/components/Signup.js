import React, { useContext, useState } from "react";
import useFormInput from "../hooks/useFormInput";
import { InputGroup, Button, Intent, Tooltip } from "@blueprintjs/core";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useHistory } from "react-router-dom";
import { store, actions } from "../store";
import { setAccessToken } from "../accessToken";
import utils from "../utils";
import { AppToaster } from "../toaster";

export default function Signup() {
  const { dispatch } = useContext(store);

  const username = useFormInput("");
  const password = useFormInput("");
  const firstName = useFormInput("");
  const lastName = useFormInput("");
  const email = useFormInput("");
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);

  async function signup() {
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
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    };
    try {
      let res = await axios.post(BASE_URL + "/api/v1/auth/signup", data);
      const { user, accessToken } = res.data;
      setAccessToken(accessToken);
      dispatch({ type: actions.SET_USER, payload: user });

      history.push(redirect);
    } catch (err) {
      console.log(err.message);
      if (err.response) {
        if (err.response.status === 422) {
          AppToaster.show({
            message: err.response.data.message,
            intent: Intent.DANGER,
          });
        }
      }
    }
  }

  function goLogin() {
    if (history.location.search) {
      const search = utils.searchToJSON(history.location.search);
      let redirect = search.redirect;
      history.push(`/login?redirect=${redirect}`);
    } else {
      history.push("/login");
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
  const inputStyle = { marginBottom: "20px" };
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
        <h1>Sign up</h1>
        <InputGroup
          style={inputStyle}
          value={firstName.value}
          onChange={firstName.onChange}
          placeholder="First Name"
        />
        <InputGroup
          style={inputStyle}
          value={lastName.value}
          onChange={lastName.onChange}
          placeholder="Last Name"
        />
        <InputGroup
          style={inputStyle}
          value={email.value}
          onChange={email.onChange}
          placeholder="Email"
        />
        <InputGroup
          style={inputStyle}
          value={username.value}
          onChange={username.onChange}
          placeholder="Username"
        />
        <InputGroup
          style={inputStyle}
          value={password.value}
          onChange={password.onChange}
          placeholder="Password"
          rightElement={lockButton}
          type={showPassword ? "text" : "password"}
        />
        <div style={{ textAlign: "right" }}>
          <Button
            text="Log in"
            onClick={goLogin}
            style={{ marginRight: "10px" }}
          />
          <Button text="Sign up" onClick={signup} intent={Intent.PRIMARY} />
        </div>
      </div>
    </div>
  );
}
