import React, { createContext, useReducer } from "react";

const initialState = {
  user: null,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    console.log(action);
    switch (action.type) {
      case actions.SET_USER:
        return { ...state, user: action.payload };
      case actions.CLEAR_USER:
        return { ...state, user: null };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

const actions = {
  SET_USER: "SET_USER",
  CLEAR_USER: "CLEAR_USER",
};

export { store, StateProvider, actions };