import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'


const initialState = {
    user: {},
    api: 'https://we-music-api.herokuapp.com/'
};
  
const reducer = (state = initialState, action) => {
    if (action.type === 'USER_SESSION') {
        return Object.assign({}, state, {
            user: action.payload
        })
    }
    return state;
}

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2
  }

const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
let persistor = persistStore(store)


export {
    store,
    persistor,
  }
