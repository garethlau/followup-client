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
    try {
      let result = await axios.get(
        `${BASE_URL}/api/v1/auth`,
        utils.getJWTConfig()
      );
      let userId = result.data._id;

      const data = {
        name: orgName.value,
        admins: [userId],
      };

      result = await axios.post(
        `${BASE_URL}/api/v1/organization/`,
        data,
        utils.getJWTConfig()
      );
      console.log(result);
      history.push(`/${result.data.organization.name}/admin`);
    } catch (err) {
      console.log(err.message);
      if (err.response) {
        if (err.response.status === 401) {
          // Not logged in
        }
      }
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
