import React, { useState, useEffect, useContext } from "react";
import {
  Tag,
  ControlGroup,
  HTMLSelect,
  Code,
  Button,
  Spinner,
  Callout,
  Intent,
  HTMLTable,
  InputGroup,
} from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { store } from "../store";
import useFormInput from "../hooks/useFormInput";
import useSelectInput from "../hooks/useSelectInput";

export default function Dashboard() {
  const { orgName } = useParams();
  const [drafts, setDrafts] = useState([]);
  const history = useHistory();
  const { state } = useContext(store);
  const search = useFormInput("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const orderBy = useSelectInput("Modified Date - ASC");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/organization/${orgName}/drafts`)
      .then((response) => {
        // console.log(response);
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
  }

  const goto = (destination) => () => {
    history.push(destination);
  };

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
    return (
      <div
        style={{
          width: "min-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spinner intent={Intent.PRIMARY} />
      </div>
    );
  }
  if (!authorized) {
    return (
      <div
        style={{
          width: "min-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Callout icon="disable" title="Not authorized">
          <div style={{ width: "350px" }}>
            {state.user ? (
              <>
                <p>
                  You're not a member of this organization. Want in? Ask for
                  access or switch to an account with permission.
                </p>
                <p>
                  Currently logged in as:{" "}
                  <Code style={{ marginLeft: "5px" }}>
                    {state.user.username}
                  </Code>
                </p>
                <Button
                  intent={Intent.PRIMARY}
                  text="Request Access"
                  disabled
                />
              </>
            ) : (
              <>
                <p style={{ width: "350px" }}>
                  You're currently not logged in. You must be logged in to
                  continue.{" "}
                </p>
                <Button
                  intent={Intent.PRIMARY}
                  onClick={goto(`/login?redirect=/${orgName}/dashboard`)}
                  text="Log in"
                />
              </>
            )}
          </div>
        </Callout>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "250px", marginBottom: "20px" }}>
        <ControlGroup>
          <InputGroup
            onChange={handleQueryChange}
            value={search.value}
            placeholder="I'm looking for..."
          />
          <HTMLSelect
            options={[
              "Send Date - ASC",
              "Send Date - DESC",
              "Modified Date - ASC",
              "Modified Date - DESC",
            ]}
            onChange={orderBy.onChange}
            value={orderBy.value}
          />
        </ControlGroup>
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
            {drafts
              .sort((a, b) => {
                let aVers =
                  a.versions.length > 0
                    ? a.versions[a.versions.length - 1]
                    : null;
                let bVers =
                  b.versions.length > 0
                    ? b.versions[b.versions.length - 1]
                    : null;

                if (orderBy.value === "Modified Date - ASC") {
                  if (!aVers && !bVers) return 0;
                  else if (!bVers) return 1;
                  else if (!aVers) return -1;
                  else {
                    return aVers.modifiedDate >= bVers.modifiedDate ? -1 : 1;
                  }
                } else if (orderBy.value === "Modified Date - DESC") {
                  if (!aVers && !bVers) return 0;
                  else if (!bVers) return -1;
                  else if (!aVers) return 1;
                  else {
                    return aVers.modifiedDate >= bVers.modifiedDate ? 1 : -1;
                  }
                } else if (orderBy.value === "Send Date - ASC") {
                  if (!aVers && !bVers) return 0;
                  else if (!bVers) return 1;
                  else if (!aVers) return -1;
                  else {
                    return aVers.sendDate >= bVers.sendDate ? -1 : 1;
                  }
                } else if (orderBy.value === "Send Date - DESC") {
                  if (!aVers && !bVers) return 0;
                  else if (!bVers) return -1;
                  else if (!aVers) return 1;
                  else {
                    return aVers.sendDate >= bVers.sendDate ? 1 : -1;
                  }
                }
              })
              .map((draft) => {
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
                                reviewer.approved
                                  ? Intent.SUCCESS
                                  : Intent.DANGER
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
