import React, { useState } from "react";
import useMedia from "../hooks/useMedia";
import Editor from "./Editor";
import ReviewerManager from "./ReviewerManager";

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
} from "@blueprintjs/core";

import { DateInput, TimePrecision } from "@blueprintjs/datetime";

import useFormInput from "../hooks/useFormInput";
import useTagInput from "../hooks/useTagInput";
import useDateInput from "../hooks/useDateInput";

export default function Composer() {
  const subject = useFormInput("");
  const sendDate = useDateInput(new Date());
  const commitMessage = useFormInput("");

  const columnCount = useMedia(["(min-width: 550px)"], [2], 1);
  const to = useTagInput();
  const cc = useTagInput();
  const bcc = useTagInput();
  const tags = useTagInput();

  /* FUNCTIONS */

  function save() {
    let data = {
      subject: subject.value,
      sendDate: sendDate.value,
      to: to.values,
      cc: cc.values,
      bcc: bcc.values,
      tags: tags.values,
    };
    console.log(data);
  }

  const reviewers = [
    {
      name: "Gareth Lau",
      version: "v2",
      lastSeen: "03/02/2020",
      approved: true,
    },
    {
      name: "John Doe",
      version: "v1",
      lastSeen: "02/27/2020",
      approved: false,
    },
  ];

  const comments = [
    {
      name: "Gareth Lau",
      version: "v2",
      date: "03/02/2020",
      body: "Looks good. Feel free to send!",
      replies: [],
    },
    {
      name: "John Doe",
      version: "v1",
      date: "02/27/2020",
      body: "Typo: 'perahps' should be 'perhaps'",
      replies: [
        {
          name: "Bob Smith",
          version: "v3",
          date: "03/01/2020",
          body: "Thanks for pointing that out. I've fixed it now.",
        },
      ],
    },
  ];

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
          {reviewers.map((review) => (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "24px 3fr 1fr 2fr 2fr",
                columnGap: "10px",
                gridTemplateRows: "24px",
                marginBottom: "10px",
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
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  {review.name}
                </div>
              </div>

              <div style={{ display: "table", height: "24px" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  {review.version}
                </div>
              </div>

              <div style={{ display: "table", height: "24px" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  {review.lastSeen}
                </div>
              </div>
              <div style={{ display: "table", height: "24px" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  {review.approved ? "Approved" : "Not Approved"}
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Button text="Add Reviewer" intent={Intent.PRIMARY} />
            <ReviewerManager isOpen={false} />
          </div>
        </div>
        <div
          style={{
            border: "solid 1px lightgrey",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          {comments.map((comment) => (
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
              <div style={{ griArea: "name-date" }}>
                {comment.name} - {comment.date}
              </div>
              <div style={{ gridArea: "version" }}> {comment.version}</div>
              <div style={{ gridArea: "body" }}>{comment.body}</div>
            </div>
          ))}
          <Divider />
          <TextArea
            style={{ marginTop: "10px" }}
            growVertically={true}
            intent={Intent.PRIMARY}
            fill={true}
            placeholder="Comment..."
          />
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <Button text="Comment" intent={Intent.PRIMARY} />
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ border: "solid 1px lightgrey", padding: "20px" }}>
          <div>
            <HTMLSelect
              style={{ marginBottom: "10px" }}
              options={["v1", "v2", "v3"]}
            />
          </div>
          <InputGroup
            style={inputStyle}
            value={subject.value}
            onChange={subject.onChange}
            placeholder="Subject"
          />
          <div style={inputStyle}>
            <DateInput
              fill
              formatDate={(date) =>
                date === null ? "" : date.toLocaleDateString()
              }
              parseDate={(str) => new Date(Date.parse(str))}
              placeholder={"Send Date"}
              onChange={sendDate.onChange}
              popoverProps={{ position: Position.BOTTOM }}
            />
          </div>
          <InputGroup style={inputStyle} placeholder="From" />
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
              tagProps={{minimal: true}}
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
              tagProps={{minimal: true}}
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
              tagProps={{minimal: true}}
            />
          </div>

          <Editor />
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
            />
          </div>
          <InputGroup
            rightElement={
              <Button
                onClick={save}
                intent={Intent.PRIMARY}
                text="Save as v4"
              />
            }
            placeholder="Commit message"
            leftIcon="info-sign"
            value={commitMessage.value}
            onChange={commitMessage.onChange}
          />
        </div>
      </div>
    </div>
  );
}
