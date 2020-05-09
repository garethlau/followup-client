import React, { useContext } from "react";
import useFormInput from "../hooks/useFormInput";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useHistory } from "react-router-dom";
import { store, actions } from "../store";
import { setAccessToken } from "../accessToken";

export default function Signup() {
  const { dispatch } = useContext(store);

  const username = useFormInput("");
  const password = useFormInput("");
  const firstName = useFormInput("");
  const lastName = useFormInput("");
  const email = useFormInput("");
  const history = useHistory();

  async function signup() {
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

      history.push("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <InputGroup
        value={username.value}
        onChange={username.onChange}
        placeholder="Username"
      />

      <InputGroup
        value={password.value}
        onChange={password.onChange}
        placeholder="Password"
      />
      <InputGroup
        value={firstName.value}
        onChange={firstName.onChange}
        placeholder="First Name"
      />
      <InputGroup
        value={lastName.value}
        onChange={lastName.onChange}
        placeholder="Last Name"
      />
      <InputGroup
        value={email.value}
        onChange={email.onChange}
        placeholder="Email"
      />
      <Button text="Sign up" onClick={signup} intent={Intent.PRIMARY} />
    </div>
  );
}
