import React from "react";
import {
  Dialog,
  Classes,
  MenuItem,
  AnchorButton,
  Button,
  Intent,
} from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
export default function ReviewerManager({
    isOpen
}) {
  const ReviewerSuggest = Suggest;
  return (
    <Dialog
      isOpen={isOpen}
      usePortal={true}
      canEscapeKeyClose={true}
      title={"Add reviewer"}
    >
      <div className={Classes.DIALOG_BODY}>
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
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button>Close</Button>

          <AnchorButton intent={Intent.PRIMARY}>Save</AnchorButton>
        </div>
      </div>
    </Dialog>
  );
}
