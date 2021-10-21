import React from 'react';
import Lobby from '../page/lobby';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
//Wrapper to wrap arouund the Lobby component during render
const Wrapper = ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

//Render Lobby and test to see if lobby cards is shown on the screen
test("Lobby cards loaded in", () => {
    const component = render(<Lobby/>, { wrapper: Wrapper })
    const cardEle = component.getByTestId("cardHeader")

    expect(cardEle.textContent).toBe("")
}) 
