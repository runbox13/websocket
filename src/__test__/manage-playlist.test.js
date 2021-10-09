import React from 'react';
import ManagePlaylist from '../page/user/manage-playlist';
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

// test("Song Title Column renders", () => {
//     const component = render(<ManagePlaylist />, { wrapper: Wrapper })
//     const playlistTable = component.getByTestId("playlist_table")

//     expect(playlistTable.textContent).toContain("Song Title")
// })

test("Manage playlist header renders", () => {
    const component = render(<ManagePlaylist />, { wrapper: Wrapper })
    const mpHeader = component.getByTestId("mpHeader")

    expect(mpHeader.textContent).toContain("Manage Playlist")
})
