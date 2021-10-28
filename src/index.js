import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory,
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

// attach state to window object for debugging
window.store = store

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Header />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  </Provider>,
  document.getElementById('root')
);
