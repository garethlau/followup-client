import React, { useState, useEffect, useContext } from "react";
import useMedia from "../hooks/useMedia";
import ReviewerManager from "./ReviewerManager";
import { AppToaster } from "../toaster";

import {
  Intent,
  InputGroup,
  HTMLSelect,
  TagInput,
  Button,
  Card,
  TextArea,
  Divider,
  Dialog,
  Classes,
  AnchorButton,
  MenuItem,
  Position,
  Callout,
  HTMLTable,
} from "@blueprintjs/core";

import { DateInput, TimePrecision } from "@blueprintjs/datetime";

import useFormInput from "../hooks/useFormInput";
import useTagInput from "../hooks/useTagInput";
import useDateInput from "../hooks/useDateInput";
import RichTextEditor, { EditorValue } from "react-rte";
import utils from "../utils";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useParams, useHistory } from "react-router-dom";
import { store } from "../store";

export default function Composer() {
  const { state } = useContext(store);
  const columnCount = useMedia(["(min-width: 550px)"], [2], 1);
  const history = useHistory();
  const { orgName } = useParams();
  const [updated, setUpdated] = useState(0);
  // Version and editor state
  const [versions, setVersions] = useState([]);
  const subject = useFormInput("");
  const from = useFormInput("");
  const sendDate = useDateInput(new Date());
  const commitMessage = useFormInput("");
  const to = useTagInput();
  const cc = useTagInput();
  const bcc = useTagInput();
  const tags = useTagInput();
  const [body, setBody] = useState(RichTextEditor.createEmptyValue());
  const [draft, setDraft] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [currVersion, setCurrVersion] = useState("v0");

  // Comment state
  const comment = useFormInput("");
  const [comments, setComments] = useState([]);

  // Reviewer state
  const [isOpen, setIsOpen] = useState(false);

  /* FUNCTIONS */

  // Check for draft Id in URL
  useEffect(() => {
    let jsonSearch = utils.searchToJSON(window.location.search);
    if (jsonSearch.draftId) {
      // Get data
      axios
        .get(`${BASE_URL}/api/v1/draft/${jsonSearch.draftId}`)
        .then((res) => {
          let { draft } = res.data;
          setDraft(draft);
          let versionNumber = draft.versions.length;

          // Build the version select dropdown
          let tmpVersions = [];
          for (let i = 1; i <= versionNumber; i++) {
            tmpVersions.push(`v${i}`);
          }
          setVersions(tmpVersions);
          setCurrVersion(`v${versionNumber}`);
          // We have set the current version to the most recent version so it must be editable
          setCanEdit(true);
          setVersionData(draft.versions[draft.versions.length - 1]);

          // Set comment data
          setComments(draft.comments);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [updated]);

  function onBodyChange(value) {
    setBody(value);
  }

  // Sset the data
  function setVersionData(data) {
    subject.setValue(data.subject);
    sendDate.set(data.sendDate);
    to.set(data.to);
    cc.set(data.cc);
    bcc.set(data.bcc);
    tags.set(data.tags);
    from.setValue(data.from);
    commitMessage.setValue(data.commitMessage);
    setBody(EditorValue.createFromString(data.body, "html"));
  }

  function changeVersion(event) {
    setCurrVersion(event.currentTarget.value);
    let versionNumber = event.currentTarget.value.substring(1) - 1;
    let viewingVersion = draft.versions[versionNumber];
    if (versionNumber + 1 === draft.versions.length) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }

    setVersionData(viewingVersion);
  }

  // Save new version
  async function save() {
    let data = {
      subject: subject.value,
      sendDate: sendDate.value,
      to: to.values,
      cc: cc.values,
      bcc: bcc.values,
      body: body.toString("html"),
      tags: tags.values,
      commitMessage: commitMessage.value,
    };
    let { draftId } = utils.searchToJSON(window.location.search);
    try {
      await axios.post(`${BASE_URL}/api/v1/draft/${draftId}/version`, data);
      AppToaster.show({
        message: "Draft saved",
        action: {
          onClick: () => history.push(`/${orgName}/dashboard`),
          text: "Go to dashboard",
        },
        intent: Intent.SUCCESS,
      });
      setUpdated(updated + 1);
    } catch (err) {
      console.log(err);

      AppToaster.show({
        message: err.message,
        intent: Intent.DANGER,
      });
    }
  }

  // Create a comment
  async function saveComment() {
    let data = {
      content: comment.value,
      version: currVersion,
    };

    let { draftId } = utils.searchToJSON(window.location.search);
    try {
      let result = await axios.post(
        `${BASE_URL}/api/v1/draft/${draftId}/comment`,
        data
      );
      comment.clear();
      setComments(result.data.comments);
    } catch (err) {
      console.log(err);
    }
  }

  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/organization/${orgName}/users`)
      .then((res) => {
        setMembers(res.data.users.concat(res.data.admins));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orgName]);

  async function approve() {
    let { draftId } = utils.searchToJSON(window.location.search);
    try {
      await axios.post(`${BASE_URL}/api/v1/draft/${draftId}/approve`);
      AppToaster.show({
        message: "You've approved this draft",
        intent: Intent.SUCCESS,
      });
      setUpdated(updated + 1);
    } catch (err) {
      console.log(err.message);
      AppToaster.show({ message: err.message, intent: Intent.DANGER });
    }
  }

  async function reject() {
    let { draftId } = utils.searchToJSON(window.location.search);
    try {
      await axios.post(`${BASE_URL}/api/v1/draft/${draftId}/reject`);
      AppToaster.show({
        message: "You've rejected this draft",
        intent: Intent.SUCCESS,
      });
      setUpdated(updated + 1);
    } catch (err) {
      console.log(err.message);
      AppToaster.show({ message: err.message, intent: Intent.DANGER });
    }
  }

  /* STYLES */

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: columnCount === 2 ? "1fr 1fr" : "1fr",
    gridTemplateRows: columnCount === 2 ? "1fr" : "auto auto",
  };

  const inputStyle = {
    width: "250px",
    marginBottom: "10px",
  };

  /* HTML */

  return (
    <div style={containerStyle}>
      <div style={{ padding: "20px" }}>
        <div style={{ border: "solid 1px lightgrey", padding: "20px" }}>
          <h1>Reviewers</h1>
          <Divider />
          {draft.reviewers &&
            draft.reviewers.length > 0 ?
            draft.reviewers.map((reviewer) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 150px 1fr 150px 100px",
                  columnGap: "10px",
                  gridTemplateRows: "24px",
                  margin: "10px 0px",
                  padding: "0px 10px",
                }}
              >
                <div>
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      margin: "2px",
                    }}
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="profile"
                  />
                </div>

                <div style={{ display: "table", height: "24px" }}>
                  <div
                    style={{ display: "table-cell", verticalAlign: "middle" }}
                  >
                    {reviewer.firstName + " " + reviewer.lastName}
                  </div>
                </div>

                <div></div>

                <div style={{ display: "table", height: "24px" }}>
                  <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                    {reviewer.approved ? (
                      <div style={{ textAlign: "center" }}>Approved</div>
                    ) : (
                      <div style={{ textAlign: "center" }}>Not Approved</div>
                    )}
                  </div>
                </div>

                <div style={{ display: "table", height: "24px" }}>
                  <div
                    style={{ display: "table-cell", verticalAlign: "middle" }}
                  >
                    {!state.user ||
                    reviewer.id !==
                      state.user._id ? null : reviewer.approved ? (
                      <Button
                        text="Reject"
                        onClick={reject}
                        intent={Intent.DANGER}
                      />
                    ) : (
                      <Button
                        text="Approve"
                        onClick={approve}
                        intent={Intent.SUCCESS}
                        small
                      />
                    )}
                  </div>
                </div>
              </div>
            )) : "No assigned reviewers."}
          <Divider />
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Button onClick={() => setIsOpen(true)} text="Manage Reviewers" />
            <ReviewerManager
              updated={updated}
              setUpdated={setUpdated}
              reviewers={draft.reviewers || []}
              members={members}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
        <div
          style={{
            border: "solid 1px lightgrey",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h1>Comments</h1>
          <Divider />
          {comments.length === 0
            ? "No comments"
            : comments.map((comment) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateAreas:
                      "'pfp name-date version' 'pfp body version' '. body .' ",
                    gridTemplateColumns: "48px 1fr 48px",
                    gridTemplateRows: "24px 24px auto",
                    marginTop: "10px",
                    columnGap: "10px",
                  }}
                >
                  <div style={{ gridArea: "pfp" }}>
                    <img
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        margin: "4px",
                      }}
                      src="https://www.w3schools.com/howto/img_avatar.png"
                      alt="profile"
                    />
                  </div>
                  <div style={{ gridArea: "name-date" }}>
                    {comment.author.firstName} {comment.author.lastName} -{" "}
                    {new Date(parseInt(comment.date)).toLocaleDateString()}
                  </div>
                  <div style={{ gridArea: "version" }}> {comment.version}</div>
                  <div style={{ gridArea: "body" }}>{comment.content}</div>
                </div>
              ))}
          <Divider />
          <TextArea
            style={{ marginTop: "10px" }}
            growVertically={true}
            intent={Intent.PRIMARY}
            fill={true}
            placeholder="Comment..."
            value={comment.value}
            onChange={comment.onChange}
          />
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <Button
              text="Comment"
              onClick={saveComment}
              intent={Intent.PRIMARY}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ border: "solid 1px lightgrey", padding: "20px" }}>
          <div>
            <HTMLSelect
              onChange={changeVersion}
              style={{ marginBottom: "10px" }}
              options={versions}
              value={currVersion}
            />
          </div>
          <InputGroup
            style={inputStyle}
            value={subject.value}
            onChange={subject.onChange}
            placeholder="Subject"
            disabled={!canEdit}
          />
          <div style={inputStyle}>
            <DateInput
              fill
              formatDate={(date) => date.toLocaleDateString()}
              parseDate={(str) => new Date(str)}
              value={sendDate.value}
              placeholder={"Send Date"}
              onChange={sendDate.onChange}
              popoverProps={{ position: Position.BOTTOM }}
              disabled={!canEdit}
              maxDate={new Date(1893562264171)}
            />
          </div>
          <InputGroup
            value={from.value}
            onChange={from.onChange}
            style={inputStyle}
            placeholder="From"
            disabled={!canEdit}
          />
          <div style={{ marginBottom: "10px" }}>
            <TagInput
              placeholder="To"
              values={to.values}
              onChange={to.onChange}
              rightElement={
                to.values.length > 0 ? (
                  <Button
                    onClick={() => to.clear()}
                    icon="cross"
                    minimal={true}
                  />
                ) : null
              }
              addOnBlur={true}
              tagProps={{ minimal: true }}
              disabled={!canEdit}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <TagInput
              placeholder="Cc"
              values={cc.values}
              onChange={cc.onChange}
              rightElement={
                cc.values.length > 0 ? (
                  <Button
                    onClick={() => cc.clear()}
                    icon="cross"
                    minimal={true}
                  />
                ) : null
              }
              addOnBlur={true}
              tagProps={{ minimal: true }}
              disabled={!canEdit}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TagInput
              placeholder="Bcc"
              values={bcc.values}
              onChange={bcc.onChange}
              rightElement={
                bcc.values.length > 0 ? (
                  <Button
                    onClick={() => bcc.clear()}
                    icon="cross"
                    minimal={true}
                  />
                ) : null
              }
              addOnBlur={true}
              tagProps={{ minimal: true }}
              disabled={!canEdit}
            />
          </div>

          <RichTextEditor
            editorClassName={"email-body-editor"}
            placeholder="Body..."
            style={{ minHeight: "400px" }}
            spellCheck={true}
            onChange={onBodyChange}
            value={body}
            disabled={!canEdit}
          />
          <div style={{ marginTop: "10px", ...inputStyle, width: "auto" }}>
            <TagInput
              placeholder="Add tags to identify this email"
              leftIcon="tag"
              rightElement={
                tags.values.length > 0 ? (
                  <Button
                    onClick={() => tags.clear()}
                    icon="cross"
                    minimal={true}
                  />
                ) : null
              }
              values={tags.values}
              onChange={tags.onChange}
              addOnBlur={true}
              tagProps={{ minimal: true }}
              disabled={!canEdit}
            />
          </div>
          <InputGroup
            rightElement={
              <Button
                onClick={save}
                intent={Intent.PRIMARY}
                text={`Save as v${versions.length + 1}`}
                disabled={!canEdit}
              />
            }
            placeholder="Commit message"
            leftIcon="info-sign"
            value={commitMessage.value}
            onChange={commitMessage.onChange}
            disabled={!canEdit}
          />
        </div>
      </div>
    </div>
  );
}
