import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'

// redux store
import store from './store/index'

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
import ManageProfile from './page/user/manage-profile'
import ManageRoom from './page/user/manage-room'
import CreateRoom from './page/user/create-room'
import UpdateRoom from './page/user/update-room'

// attach state to window object for debugging
window.store = store

ReactDOM.render(
  <Provider store={store}>
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
        
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  </Provider>,
  document.getElementById('root')
);
