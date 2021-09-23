import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

// redux store
import {store, persistor} from './store/index'

// css
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// partials
import Header from './partial/header'
import Footer from './partial/footer'

// pages
import App from './App.js'
import Lobby from "./page/lobby"
import Login from './page/login'
import NotFound from "./page/404"
import Register from './page/register'
import Profile from './page/profile'
import Chatroom from './page/chatroom'
import ManageProfile from './page/user/manage-profile'
import ManageRoom from './page/user/manage-room'
import CreateRoom from './page/user/create-room'
import UpdateRoom from './page/user/update-room'

// attach state to window object for debugging
window.store = store

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={"Loading... previous state"} persistor={persistor}>
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/lobby" component={Lobby} />
        
        <Route path="/profile" component={Profile} />

        <Route exact path="/manage-profile" component={ManageProfile} />
        <Route exact path="/manage-rooms" component={ManageRoom} />
        <Route exact path="/manage-rooms/create" component={CreateRoom} />
        <Route exact path="/manage-rooms/update" component={UpdateRoom} />

        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />        
        <Route path="/chatroom" component={Chatroom} />
        
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
