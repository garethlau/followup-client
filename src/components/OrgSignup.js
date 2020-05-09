import React from "react";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import { BASE_URL } from "../constants";
import utils from "../utils";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function OrgSignup() {
  const history = useHistory();
  const username = useFormInput("");
  const firstName = useFormInput("");
  const lastName = useFormInput("");
  const password = useFormInput("");
  const email = useFormInput("");

  const orgName = useFormInput("");

  const inputStyle = {
    marginBottom: "10px",
  };

  async function create() {
    const signupData = {
      username: username.value,
      password: password.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
    };

    try {
      let result = await axios.post(
        `${BASE_URL}/api/v1/auth/signup`,
        signupData
      );
      let { user, token } = result.data;
          utils.setJWT(token);
          console.log(user)

      const orgData = {
        name: orgName.value,
        admins: [user._id],
      };

      result = await axios.post(
        `${BASE_URL}/api/v1/organization`,
        orgData,
      );

      let { name } = result.data.organization;
      history.push(`${name}/admin`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div style={{ width: "500px" }}>
        Create an account
        <InputGroup
          placeholder="Username"
          value={username.value}
          onChange={username.onChange}
          style={inputStyle}
        />
        <InputGroup
          placeholder="Password"
          value={password.value}
          onChange={password.onChange}
          style={inputStyle}
        />
        <InputGroup
          placeholder="Email"
          value={email.value}
          onChange={email.onChange}
          style={inputStyle}
        />
        <InputGroup
          placeholder="First Name"
          value={firstName.value}
          onChange={firstName.onChange}
          style={inputStyle}
        />
        <InputGroup
          placeholder="Last Name"
          value={lastName.value}
          onChange={lastName.onChange}
          style={inputStyle}
        />
        <InputGroup
          placeholder="Organization Name"
          value={orgName.value}
          onChange={orgName.onChange}
          style={inputStyle}
        />
      </div>
      <Button
        intent={Intent.PRIMARY}
        onClick={create}
        text="Create Organization"
      />
    </div>
  );
}
