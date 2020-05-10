import React from "react";
import { useHistory } from "react-router-dom";
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  NavbarHeading,
  Alignment,
  Button,
  Intent,
} from "@blueprintjs/core";

export default function StatelessNav() {
  const history = useHistory();

  const goto = (destination) => () => {
    history.push(destination);
  };

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Followup</NavbarHeading>
        <NavbarDivider />
        <Button text="Home" onClick={goto("/")} minimal />
        <Button text="Learn More" onClick={goto("/product")} minimal />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button text="Log in" onClick={goto("/login")} minimal />
        <Button
          text="Sign up"
          onClick={goto("/signup")}
          outlined
          intent={Intent.PRIMARY}
        />
      </NavbarGroup>
    </Navbar>
  );
}
