import { useState } from "react";

export default function useDateInput({ initialDate }) {
  const [date, setDate] = useState(initialDate || null);

  function onChange(date) {
    setDate(date);
  }

  function set(date) {
    setDate(date);
  }
  function clear() {
    setDate(null);
  }

  return {
    value: date,
    onChange: onChange,
    set: set,
    clear: clear,
  };
}
