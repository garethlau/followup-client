import { useState } from "react";

export default function useSelectInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange(event) {
    setValue(event.currentTarget.value);
  }

  return {
    value,
    onChange,
  };
}
