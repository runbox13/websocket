import React from 'react';
import ManagePlaylist from '../page/user/manage-playlist';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
//Wrapper to wrap arouund the ManagePlaylist component during render
const Wrapper = ({ children }) => (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

  //Render ManagePlaylist and test to see if "Manage Playlist" is shown on the screen
test("Manage playlist header renders", () => {
    const component = render(<ManagePlaylist />, { wrapper: Wrapper })
    const mpHeader = component.getByTestId("mpHeader")

    expect(mpHeader.textContent).toContain("Manage Playlist")
})
