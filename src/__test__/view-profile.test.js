import React from 'react';
import Profile from '../page/profile.js';
import { render, screen } from '@testing-library/react';
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


it('Shows Bio', () => {
  render(<Profile />, {wrapper: Wrapper});
  expect(screen.getByText('Bio')).toBeInTheDocument();
});
