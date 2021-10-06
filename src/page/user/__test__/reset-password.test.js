import React from 'react';
import ResetPassword from '../reset-password';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from '../../../store/index';

const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

test("header renders with correct text", () => {
    const component = render(<ResetPassword />, { wrapper: Wrapper })
    const headerEle = component.getByTestId("resetPassHeader")

    expect(headerEle.textContent).toBe("Reset Password")
})