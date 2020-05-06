import { useState } from "react";

export default function useDateInput(initialDate) {
  const [value, setValue] = useState(initialDate || null);

  function onChange(date) {
    setValue(date);
  }

  function set(date) {
    setValue(new Date(date));
  }
  function clear() {
    setValue(null);
  }

  return {
    value: value,
    onChange: onChange,
    set: set,
    clear: clear,
  };
}
