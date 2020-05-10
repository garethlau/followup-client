import React from "react";

const imgStyle = {
  boxShadow: "0 8px 12px -6px black",
  width: "700px",
};
const pStyle = {
  marginTop: "30px",
};
export default function Product() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Product</h1>
      <p style={pStyle}>
        View current drafts and sent emails at a glance. Search for particular
        emails.
      </p>
      <img
        style={imgStyle}
        alt="Screen shot of application dashboard."
        src={require("../assets/images/dashboard-demo.png")}
      />

      <p style={pStyle}>Collaboratively compose drafts. </p>
      <img
        style={imgStyle}
        alt="Screen shot of compose draft view"
        src={require("../assets/images/composer-demo.png")}
      />
    </div>
  );
}
