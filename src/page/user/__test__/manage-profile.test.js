import React from 'react';
import ManageProfile from '../manage-profile';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from '../../../store/index';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

test("header renders with correct text", () => {
    const component = render(<ManageProfile />, { wrapper: Wrapper })
    const headerEle = component.getByTestId("manageProfileHeader")

    expect(headerEle.textContent).toBe("Manage Profile")
})