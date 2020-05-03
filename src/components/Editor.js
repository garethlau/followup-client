import React, { useState } from "react";
import RichTextEditor from "react-rte";

export default function Editor() {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());

  function onChange(value) {
    console.log(value);
    setValue(value);
  }

  return (
    <RichTextEditor
      editorClassName={"email-body-editor"}
      placeholder="Body..."
      style={{ minHeight: "400px" }}
      spellCheck={true}
      onChange={onChange}
      value={value}
    />
  );
}
