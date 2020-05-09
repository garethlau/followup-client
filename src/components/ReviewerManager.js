import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  MenuItem,
  AnchorButton,
  Button,
  Intent,
  HTMLSelect,
  Checkbox,
} from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import utils from "../utils";
import { BASE_URL } from "../constants";
import axios from "axios";
import { AppToaster } from "../toaster";

export default function ReviewerManager({
  isOpen,
  setIsOpen,
  members,
  reviewers,
}) {
  const ReviewerSuggest = Suggest;

  const [tmpMembers, setTempMembers] = useState([]);

  async function saveReviewers() {
    let data = {
      reviewerIds: JSON.stringify(
        tmpMembers
          .filter((member) => member.checked)
          .map((member) => member._id)
      ),
    };
    let { draftId } = utils.searchToJSON(window.location.search);

    try {
      let result = await axios.post(
        `${BASE_URL}/api/v1/draft/${draftId}/reviewer`,
        data
      );
      console.log(result);
      setIsOpen(false);
      AppToaster.show({
        message: "Succesfully updated reviewers",
        action: {
          onClick: () => window.location.reload(false),
          text: "Reload",
        },
        intent: Intent.SUCCESS,
      });
    } catch (err) {
      AppToaster.show({
        message: err.message,
        intent: Intent.DANGER,
      });
    }
  }
  const toggleCheck = (_id) => (event) => {
    let tmp = tmpMembers.map((member) => {
      if (member._id === _id) {
        member.checked = event.target.checked;
      }
      return member;
    });
    setTempMembers(tmp);
  };

  useEffect(() => {
    console.log(members, reviewers);
    setTempMembers(
      members.map((member) => {
        return {
          ...member,
          checked: reviewers
            .map((reviewer) => reviewer.id)
            .includes(member._id),
        };
      })
    );
  }, [reviewers, members]);

  return (
    <Dialog
      isOpen={isOpen}
      usePortal={true}
      canEscapeKeyClose={true}
      title={"Add reviewer"}
      onClose={() => setIsOpen(false)}
    >
      <div className={Classes.DIALOG_BODY}>
        {tmpMembers.map((member) => {
          return (
            <Checkbox
              label={`${member.firstName} ${member.lastName}`}
              checked={member.checked}
              onChange={toggleCheck(member._id)}
            />
          );
        })}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => setIsOpen(false)}>Close</Button>

          <AnchorButton onClick={saveReviewers} intent={Intent.PRIMARY}>
            Save
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  );
}

/*

        <ReviewerSuggest
          onItemSelect={(item) => console.log(item)}
          items={[
            { name: "Gareth Lau", email: "gareth@mail.com" },
            { name: "John Doe", email: "Johndoe@mail.com" },
          ]}
          inputValueRenderer={(item) => item.name}
          itemRenderer={(item, { handleClick, modifiers, query }) => {
            return <MenuItem onClick={handleClick} text={item.name} />;
          }}
          onQueryChange={(query) => console.log(query)}
        />

 */
