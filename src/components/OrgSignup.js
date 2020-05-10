import React, { useState, useContext } from "react";
import { InputGroup, Button, Intent, Tooltip } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AppToaster } from "../toaster";
import { setAccessToken } from "../accessToken";
import { store, actions } from "../store";

export default function OrgSignup() {
  const {  dispatch } = useContext(store);
  const history = useHistory();
  const username = useFormInput("");
  const firstName = useFormInput("");
  const lastName = useFormInput("");
  const password = useFormInput("");
  const email = useFormInput("");
  const [showPassword, setShowPassword] = useState(false);

  const orgName = useFormInput("");

  const [stepNum, setStepNum] = useState(0);

  async function create() {
    let user = null;
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

      let { accessToken } = result.data;
      user = result.data.user;
      if (!accessToken || !user) {
        // Something went wrong
        AppToaster.show({
          message:
            "There was an error creating your account. Please try again later.",
          intent: Intent.DANGER,
        });
        return;
      }

      setAccessToken(accessToken);
      dispatch({ type: actions.SET_USER, payload: user });
    } catch (err) {
      if (err.response.status === 422) {
        AppToaster.show({
          message: err.response.data.message,
          intent: Intent.DANGER,
        });
      }
    }

    const orgData = {
      name: orgName.value,
      admins: [user._id],
    };

    try {
      let result = await axios.post(`${BASE_URL}/api/v1/organization`, orgData);
      let { name } = result.data.organization;
      AppToaster.show({
        message:
          "Your account and organization have been created. Redirecting to admin page.",
        intent: Intent.SUCCESS,
      });
      setTimeout(() => {
        history.push(`${name}/admin`);
      }, 3000);
    } catch (err) {
      console.log(err.messsage);
      AppToaster.show({
        message:
          "There was an error creating the organization. Please try again later.",
        intent: Intent.DANGER,
      });
    }
  }

  function validateForm() {
    if (firstName.value.trim() === "") return "First name cannot be blank.";
    if (lastName.value.trim() === "") return "Last name cannot be blank.";
    if (email.value.trim() === "") return "Email cannot be blank.";
    if (username.value.trim() === "") return "Username cannot be blank.";
    if (password.value.trim() === "") return "Password cannot be blank.";
  }

  const inputStyle = { marginBottom: "20px" };
  const changeStepNum = (curr, next) => () => {
    console.log(curr, next);
    if (curr === 0) {
      // Check for valid form entries
      let errorMessage = validateForm();
      if (errorMessage) {
        AppToaster.show({
          message: errorMessage,
          intent: Intent.DANGER,
        });
      } else {
        setStepNum(next);
      }
    } else {
      setStepNum(next);
    }
  };

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
  if (stepNum === 0) {
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
          <h1>First, create an account</h1>
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
            placeholder="Email"
            value={email.value}
            onChange={email.onChange}
            style={inputStyle}
          />
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
            rightElement={lockButton}
            type={showPassword ? "text" : "password"}
          />
          <div style={{ textAlign: "right" }}>
            <Button
              intent={Intent.PRIMARY}
              onClick={changeStepNum(0, 1)}
              text="Next"
            />
          </div>
        </div>
      </div>
    );
  } else if (stepNum === 1) {
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
          <h1>Create organization</h1>
          <p>You will automatically added as an admin to this organization.</p>
          <InputGroup
            placeholder="Organization Name"
            value={orgName.value}
            onChange={orgName.onChange}
            style={inputStyle}
          />
          <div style={{ textAlign: "right" }}>
            <Button
              style={{ marginRight: "5px" }}
              onClick={changeStepNum(1, 0)}
              text="Go Back"
            />
            <Button
              intent={Intent.PRIMARY}
              onClick={create}
              text="Create Organization"
            />
          </div>
        </div>
      </div>
    );
  }
}
