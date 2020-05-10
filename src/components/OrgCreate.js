import React, { useContext } from "react";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import axios from "axios";
import { BASE_URL } from "../constants";
import { store } from "../store";
import { useHistory } from "react-router-dom";
import { AppToaster } from "../toaster";

export default function OrgJoin() {
  const history = useHistory();
  const orgName = useFormInput("");
  const { state } = useContext(store);

  async function create() {
    if (!state.user) {
      // User must be logged in to create an organization
      AppToaster.show({
        message: "You need an account to create an organization.",
        action: {
          onClick: () => history.push("/get-started"),
          text: "Get Started",
        },
        intent: Intent.DANGER,
      });
      return;
    }

    if (orgName.value.trim() === "") {
      AppToaster.show({
        message: "Organization name cannot be blank",
        intent: Intent.DANGER,
      });
      return;
    }

    const data = {
      name: orgName.value,
      admins: [state.user._id],
    };

    try {
      let result = await axios.post(`${BASE_URL}/api/v1/organization/`, data);
      AppToaster.show({
        message:
          "Successfully created organization. Redirecting to admin page.",
        intent: Intent.SUCCESS,
      });
      setTimeout(() => {
        history.push(`/${result.data.organization.name}/admin`);
      }, 3000);
    } catch (err) {
      AppToaster.show({
        message: err.message,
        intent: Intent.DANGER,
      });
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
        <h1>Create an organization</h1>
        <p>You will automatically be added as an admin to this organization.</p>
        <InputGroup
          placeholder="Organization Name"
          value={orgName.value}
          onChange={orgName.onChange}
          style={{ marginBottom: "20px" }}
        />
        <div style={{ textAlign: "right" }}>
          <Button intent={Intent.PRIMARY} onClick={create} text="Create" />
        </div>
      </div>
    </div>
  );
}
