import React from "react";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import axios from "axios";
import { BASE_URL } from "../constants";
import { AppToaster } from "../toaster";
import { useHistory } from "react-router-dom";

export default function OrgJoin() {
  const history = useHistory();
  const orgName = useFormInput("");

  async function join() {
    if (orgName.value.trim() === "") {
      AppToaster.show({
        message: "Organization name cannot be blank.",
        intent: Intent.DANGER,
      });
      return;
    }
    try {
      let name = orgName.value.replace(/ /g, "-");
      await axios.patch(`${BASE_URL}/api/v1/organization/${name}/users`);
      AppToaster.show({
        message: `You've sucessfully joined ${name}. Redirecting to dashboard.`,
        intent: Intent.SUCCESS,
      });
      setTimeout(() => {
        history.push(`/${name}/dashboard`);
      }, 3000);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          AppToaster.show({
            message: "Organization does not exist.",
            intent: Intent.DANGER,
          });
        } else if (err.response.status === 401) {
          AppToaster.show({
            message: "You need to be logged in to join an organization.",
            intent: Intent.DANGER,
            action: {
              onClick: () => history.push("/login?redirect=/join"),
              text: "Log in",
            },
          });
        }
      }
    }
  }

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
        <h1>Join an organization</h1>
        <p>Enter the organization name you want to join. </p>
        <InputGroup
          style={{ marginBottom: "20px" }}
          placeholder="my-cool-organization"
          value={orgName.value.replace(/ /g, "-")}
          onChange={orgName.onChange}
        />
        <div style={{ textAlign: "right" }}>
          <Button intent={Intent.PRIMARY} onClick={join} text="Join" />
        </div>
      </div>
    </div>
  );
}
