import React from 'react';
import ResetPassword from '../page/user/reset-password';
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

test("header renders with correct text", () => {
  const component = render(<ResetPassword />, { wrapper: Wrapper })
  const headerEle = component.getByTestId("resetPassHeader")

  expect(headerEle.textContent).toBe("Reset Password")
})