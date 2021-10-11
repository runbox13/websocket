import React from 'react';
import ManageProfile from '../page/user/manage-profile';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';

//Wrapper to wrap arouund the ManageProfile component during render
const Wrapper = ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

//Render ManageProfile and test to see if "Manage Profile" is shown on the screen
test("header renders with correct text", () => {
    const component = render(<ManageProfile />, { wrapper: Wrapper })
    const headerEle = component.getByTestId("manageProfileHeader")

    expect(headerEle.textContent).toBe("Manage Profile")
})