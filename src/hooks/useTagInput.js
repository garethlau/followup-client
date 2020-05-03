import { useState } from "react";

export default function useTagInput(initialValues) {
  const [values, setValues] = useState(initialValues || []);

  function clear() {
    setValues([]);
  }

  function add(tag) {
    setValues([...values, tag]);
  }

  function set(tags) {
    setValues(tags);
  }
  function onChange(tags) {
    setValues(tags);
  }
  return {
    values,
    clear,
    set,
    add,
    onChange,
  };
}
