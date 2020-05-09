import React, { useState, useEffect, useContext } from "react";
import { Tag, Button, Intent, HTMLTable, InputGroup } from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { store } from "../store";
import useFormInput from "../hooks/useFormInput";

export default function Dashboard() {
  const { orgName } = useParams();
  const [drafts, setDrafts] = useState([]);
  const history = useHistory();
  const { state } = useContext(store);
  const search = useFormInput("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/organization/${orgName}/drafts`)
      .then((response) => {
        console.log(response);
        setDrafts(response.data.drafts);
        setAuthorized(true);
      })
      .catch((err) => {
        console.log(err.message);
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authorized) {
    return <div>Not Authorized</div>;
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
              <th style={{ minWidth: "100px" }}>Versions</th>
              <th style={{ minWidth: "100px" }}>Send Date</th>
              <th style={{ minWidth: "250px" }}>To</th>
              <th style={{ minWidth: "250px" }}>Subject</th>
              <th style={{ minWidth: "125px" }}>Last Modified</th>
              <th style={{ minWidth: "250px" }}>Latest Commit Message</th>
              <th style={{ minWidth: "250px" }}>Tags</th>
              <th style={{ minWidth: "150px" }}>Reviewers</th>
              <th style={{ minWidth: "150px" }}>Approvals</th>
              <th style={{ minWidth: "100px" }}>Status</th>
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
                            style={{ margin: "0px 5px 5px 0px" }}
                          >
                            {recipient}
                          </Tag>
                        ))}
                    </td>

                    <td>{latestVersion ? latestVersion.subject : ""}</td>

                    <td style={{ textAlign: "center" }}>
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
                            key={index}
                            style={{ margin: "0px 5px 5px 0px" }}
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
                            style={{ margin: "0px 5px 5px 0px" }}
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
              } else return null;
            })}
          </tbody>
        </HTMLTable>
      </div>
    </div>
  );
}
