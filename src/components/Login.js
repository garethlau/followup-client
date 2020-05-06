import React, { useContext } from "react";
import { InputGroup, Button } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import utils from "../utils";
import { store, actions } from "../store";

export default function Login() {
  const { dispatch } = useContext(store);

  const username = useFormInput("");
  const password = useFormInput("");
  const history = useHistory();

  async function login() {
    let data = {
      username: username.value,
      password: password.value,
    };
    try {
      let result = await axios.post(BASE_URL + "/api/v1/auth/login", data);
      const { token, user } = result.data;
      utils.setJWT(token);
      dispatch({ type: actions.SET_USER, payload: user });

      history.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <InputGroup
        placeholder="Username"
        value={username.value}
        onChange={username.onChange}
      />
      <InputGroup
        placeholder="Password"
        value={password.value}
        onChange={password.onChange}
      />
      <Button text="Log in" onClick={login} />
    </div>
  );
}
