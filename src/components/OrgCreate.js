import React, { useContext } from "react";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import utils from "../utils";
import axios from "axios";
import { BASE_URL } from "../constants";
import { store } from "../store";
import { useHistory } from "react-router-dom";

export default function OrgJoin() {
  const history = useHistory();
  const orgName = useFormInput("");
  const { state } = useContext(store);

  async function create() {
    console.log(state.user);
    if (!state.user) {
      // User must be logged in to create an organization
      return;
    }

    const data = {
      name: orgName.value,
      admins: [state.user._id],
    };

    try {
      let result = await axios.post(`${BASE_URL}/api/v1/organization/`, data);
      console.log(result)
      history.push(`/${result.data.organization.name}/admin`);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <InputGroup
        placeholder="Organization Name"
        value={orgName.value}
        onChange={orgName.onChange}
      />
      <Button intent={Intent.PRIMARY} onClick={create} text="Create" />
    </div>
  );
}
