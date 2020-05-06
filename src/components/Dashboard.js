import React, { useState, useEffect, useContext } from "react";
import { Tag, Button, Intent, HTMLTable, InputGroup } from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import utils from "../utils";
import { store } from "../store";
import useFormInput from "../hooks/useFormInput";

export default function Dashboard() {
  const { orgName } = useParams();
  const [drafts, setDrafts] = useState([]);
  const history = useHistory();
  const { state } = useContext(store);
  const search = useFormInput("");

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

  function edit(id) {
    return function () {
      history.push(`/${orgName}/compose?draftId=${id}`);
    };
  }

  function handleQueryChange(e) {
    search.onChange(e);
    console.log(e.target.value);
  }

  function passesFilter(draft) {
    let latestVersion =
      draft.versions.length > 0
        ? draft.versions[draft.versions.length - 1]
        : null;

    function containsSearch(elem) {
      return elem.toLowerCase().includes(search.value.toLowerCase());
    }

    return (
      (latestVersion && latestVersion.tags.some(containsSearch)) ||
      (latestVersion &&
        latestVersion.subject
          .toLowerCase()
          .includes(search.value.toLowerCase())) ||
      (latestVersion && latestVersion.to.some(containsSearch)) ||
      (latestVersion &&
        latestVersion.commitMessage
          .toLowerCase()
          .includes(search.value.toLowerCase())) ||
      draft.creator.firstName.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "250px", marginBottom: "20px" }}>
        <InputGroup
          onChange={handleQueryChange}
          value={search.value}
          placeholder="I'm looking for..."
        />
      </div>

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
            {drafts.map((draft) => {
              let latestVersion =
                draft.versions.length > 0
                  ? draft.versions[draft.versions.length - 1]
                  : null;
              if (passesFilter(draft)) {
                return (
                  <tr onClick={edit(draft._id)} key={draft._id}>
                    <td>
                      {draft.creator.firstName + " " + draft.creator.lastName}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {draft.versions.length}
                    </td>

                    <td>
                      {latestVersion &&
                        new Date(latestVersion.sendDate).toLocaleDateString()}
                    </td>

                    <td>
                      {latestVersion &&
                        latestVersion.to.map((recipient, index) => (
                          <Tag
                            minimal
                            key={index}
                            style={{ marginRight: "5px" }}
                          >
                            {recipient}
                          </Tag>
                        ))}
                    </td>

                    <td>{latestVersion ? latestVersion.subject : ""}</td>

                    <td>
                      {latestVersion
                        ? new Date(
                            parseInt(latestVersion.modifiedDate)
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>{latestVersion && latestVersion.commitMessage}</td>

                    <td>
                      {latestVersion &&
                        latestVersion.tags.map((tag, index) => (
                          <Tag
                            minimal
                            style={{ marginRight: "5px" }}
                            key={index}
                          >
                            {tag}
                          </Tag>
                        ))}
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
                            minimal={
                              !state.user || reviewer.id !== state.user._id
                            }
                          >
                            {reviewer.firstName[0] + reviewer.lastName[0]}
                          </Tag>
                        );
                      })}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {draft.reviewers.reduce((acc, curr) => {
                        if (curr.approved) acc++;
                        return acc;
                      }, 0)}
                      / {draft.reviewers.length}
                    </td>

                    <td>{draft.sent ? "Sent" : "Not Sent"}</td>
                  </tr>
                );
              }
              else return null;
            })}
          </tbody>
        </HTMLTable>
      </div>
    </div>
  );
}
