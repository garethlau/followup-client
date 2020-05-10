import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Intent } from "@blueprintjs/core";

export default function Home() {
  const history = useHistory();
  return (
    <div>
      <div
        style={{
          width: "550px",
          height: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <img
          alt="logo"
          style={{ width: "150px" }}
          src={require("../assets/images/logo.png")}
        />
        <h1>Followup</h1>
        <p>Email composer and manager for teams.</p>
        <Button
          text="Get Started"
          onClick={() => history.push("/get-started")}
          intent={Intent.PRIMARY}
        />
      </div>
    </div>
  );
}
