import React from 'react';
import Profile from '../page/profile.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';

//Wrapper to wrap arouund the Profile component during render
const Wrapper = ({ children }) => (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

//Render Profile and test to see if "Profile" is shown on the screen
it('Shows Bio', () => {
  render(<Profile />, {wrapper: Wrapper});
  expect(screen.getByText('Bio')).toBeInTheDocument();
});
