import { createStore } from 'redux'

const initialState = {
    user: {},
    api: 'http://localhost:8000'
};
  
const reducer = (state = initialState, action) => {
    if (action.type === 'USER_SESSION') {
        return Object.assign({}, state, {
            user: action.payload
        })
    }
    return state;
}

const store = createStore(reducer);

export default store;