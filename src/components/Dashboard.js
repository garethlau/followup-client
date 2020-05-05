import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Button, Intent, HTMLTable } from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import utils from "../utils";

export default function Dashboard() {
  const { orgName } = useParams();
  const [drafts, setDrafts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/organization/${orgName}/drafts`)
      .then((response) => {
        console.log(response);
        setDrafts(response.data.drafts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orgName]);

  async function createDraft() {
    let config = utils.getJWTConfig();
    try {
      let res = await axios.post(
        BASE_URL + "/api/v1/draft",
        {
          orgName,
        },
        config
      );
      let { draft } = res.data;
      let draftId = draft._id;
      history.push(`/${orgName}/compose?draftId=${draftId}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Nav />
      <HTMLTable>
        <thead>
          <tr>
            <th>Creator</th>
            <th>Versions</th>
            <th>Sent?</th>
            <th>Reviewers</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft) => (
            <tr>
              <td>{draft.creator.firstName + " " + draft.creator.lastName}</td>
              <td>{draft.versions.length}</td>
              <td>{draft.sent}</td>
              <td>{draft.reviewers}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
      <Button
        text="Create Draft"
        intent={Intent.PRIMARY}
        onClick={createDraft}
      />
    </div>
  );
}
