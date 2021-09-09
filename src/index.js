import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

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

ReactDOM.render(
  <Router>
    <Header />
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
    <Footer />
  </Router>,
  document.getElementById('root')
  );
