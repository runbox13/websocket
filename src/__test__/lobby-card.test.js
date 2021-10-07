import React from 'react';
import Lobby from '../page/lobby';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';

const Wrapper = ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

test("Lobby cards loaded in ", () => {
    const component = render(<Lobby/>, { wrapper: Wrapper })
    const cardEle = component.getByTestId("cardHeader")

    expect(cardEle.textContent).toBe("")
}) 
