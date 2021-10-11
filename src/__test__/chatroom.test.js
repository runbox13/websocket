import React from 'react';
import Chatroom from '../page/chatroom.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
//Wrapper to wrap arouund the Chatroom component during render
const Wrapper = ({ children }) => (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

//Render Chatroom and test to see if "Playlist" is shown on the screen
it('Page loads with correct text on the screen', () => {
  render(<Chatroom />, {wrapper: Wrapper});
  expect(screen.getByText('Playlist')).toBeInTheDocument();
});
