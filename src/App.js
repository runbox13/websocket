import './App.css'
import React from 'react'
import logo from './logo.svg'
import { connect } from 'react-redux'

<<<<<<< HEAD
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to WeMusic
        </p>
        <a
          className="App-link"
          href="https://canvas.uts.edu.au/"
          target="_blank"
          rel="noopener noreferrer"
        >
          UTS Canvas
        </a>
      </header>
    </div>
  );
=======
class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch
  }
>>>>>>> 8e5b20bca62f96e2597777f09e1067422aac47e3
}

export default connect(
  mapDispatchToProps
)(App)
