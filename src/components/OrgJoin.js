import React from "react";
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import useFormInput from "../hooks/useFormInput";
import utils from "../utils";
import axios from "axios";
import { BASE_URL } from "../constants";

export default function OrgJoin() {
  const orgName = useFormInput();

  async function join() {
    const config = utils.getJWTConfig();
    try {
      let result = await axios.patch(
        `${BASE_URL}/api/v1/organization/${orgName.value}/users`,
        {},
        config
      );
      console.log(result);
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
      <Button intent={Intent.PRIMARY} onClick={join} text="Join" />
    </div>
  );
}
