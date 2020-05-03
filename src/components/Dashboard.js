import React from "react";
import Nav from "./Nav";
import { Button, Intent } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import utils from "../utils";

export default function Dashboard() {
  const history = useHistory();

  async function createDraft() {
    let config = utils.getJWTConfig();
    try {
      let res = await axios.post(BASE_URL + "/api/v1/draft", {}, config);
      let { draft } = res.data;
      let draftId = draft._id;
      history.push("/compose?draftId=" + draftId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Nav />
      <Button
        text="Create Draft"
        intent={Intent.PRIMARY}
        onClick={createDraft}
      />
    </div>
  );
}
