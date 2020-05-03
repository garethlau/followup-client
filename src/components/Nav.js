import React from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Alignment,
  NavbarHeading,
  Classes,
} from "@blueprintjs/core";

export default function Nav() {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>App</NavbarHeading>
        <NavbarDivider />
        <Button className={Classes.MINIMAL} icon="home" text="Home" />
        <Button className={Classes.MINIMAL} icon="document" text="Files" />
      </NavbarGroup>
    </Navbar>
  );
}
