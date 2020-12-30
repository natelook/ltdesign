import React, { createContext } from 'react';

const UiContext = createContext();

let initialState = {
  displayCart: false,
};

let reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return { displayCart: true };
    case 'CLOSE':
      return { displayCart: false };
  }
};

function UiContextProvider({ children }) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

let UiContextConsumer = UiContext.Consumer;

export { UiContext, UiContextProvider, UiContextConsumer };
