import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store/index'

// css
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// partials
import Header from './partial/header';
import Footer from './partial/footer';

// pages
import App from './App.js'
import Login from './page/login';
import NotFound from "./page/404";
import Register from './page/register';

// attach state to window object for debugging
window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  </Provider>,
  document.getElementById('root')
);
