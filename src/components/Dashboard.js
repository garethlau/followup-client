import React, { useState, useEffect, useContext } from "react";
import { Tag, Button, Intent, HTMLTable, TagInput } from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import utils from "../utils";
import { store } from "../store";

export default function Dashboard() {
  const { orgName } = useParams();
  const [drafts, setDrafts] = useState([]);
  const history = useHistory();
  const { state } = useContext(store);

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

  function edit(id) {
    return function () {
      history.push(`/${orgName}/compose?draftId=${id}`);
    };
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ overflow: "auto" }}>
        <HTMLTable bordered interactive>
          <thead>
            <tr>
              <th style={{ minWidth: "150px" }}>Creator</th>
              <th>Versions</th>
              <th>Send Date</th>
              <th>To</th>
              <th style={{ width: "250px" }}>Subject</th>
              <th>Last Modified</th>
              <th style={{ minWidth: "250px" }}>Latest Commit Message</th>
              <th>Tags</th>
              <th style={{ minWidth: "150px" }}>Reviewers</th>
              <th>Approvals</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
              <tr onClick={edit(draft._id)} key={draft._id}>
                <td>
                  {draft.creator.firstName + " " + draft.creator.lastName}
                </td>
                <td style={{ textAlign: "center" }}>{draft.versions.length}</td>

                <td>
                  {draft.versions.length > 0 &&
                    new Date(
                      draft.versions[draft.versions.length - 1].sendDate
                    ).toLocaleDateString()}
                </td>

                <td>
                  {draft.versions.length > 0 &&
                    draft.versions[draft.versions.length - 1].to.map(
                      (recipient, index) => (
                        <Tag minimal key={index} style={{ marginRight: "5px" }}>
                          {recipient}
                        </Tag>
                      )
                    )}
                </td>

                <td>
                  {draft.versions.length > 0
                    ? draft.versions[draft.versions.length - 1].subject
                    : ""}
                </td>

                <td>
                  {draft.versions.length > 0
                    ? new Date(
                        parseInt(
                          draft.versions[draft.versions.length - 1].modifiedDate
                        )
                      ).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>
                  {draft.versions.length > 0 &&
                    draft.versions[draft.versions.length - 1].commitMessage}
                </td>

                <td>
                  {draft.versions.length > 0 &&
                    draft.versions[draft.versions.length - 1].tags.map(
                      (tag, index) => (
                        <Tag minimal style={{ marginRight: "5px" }} key={index}>
                          {tag}
                        </Tag>
                      )
                    )}
                </td>

                <td>
                  {draft.reviewers.map((reviewer) => {
                    return (
                      <Tag
                        key={reviewer.id}
                        style={{ marginRight: "5px" }}
                        intent={
                          reviewer.approved ? Intent.SUCCESS : Intent.DANGER
                        }
                        minimal={reviewer.id !== state.user._id}
                      >
                        {reviewer.firstName[0] + reviewer.lastName[0]}
                      </Tag>
                    );
                  })}
                </td>

                <td style={{ textAlign: "center" }}>
                  {draft.reviewers.reduce(
                    (acc, curr) => (curr.approved ? acc++ : acc),
                    0
                  )}{" "}
                  / {draft.reviewers.length}
                </td>

                <td>{draft.sent ? "Sent" : "Not Sent"}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
      <Button
        text="Create Draft"
        intent={Intent.PRIMARY}
        onClick={createDraft}
      />
    </div>
  );
}
