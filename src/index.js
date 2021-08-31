import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function HelloWorld(props) {
  console.log(props);
  return (
    <div>
     <h1>{props.name}</h1>
     <p>Something cool</p>
    </div>
  );
}

ReactDOM.render(
  <HelloWorld name="Hello World!"/>,
  document.getElementById('root')
);
