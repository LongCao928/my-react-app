import logo from './logo.svg';
import './App.css';

import Button from './button/button';
// import { Component } from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://zh-hans.react.dev/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Button />
    </div>
  );
}

// Code Splitting
/* class App extends Component {
  handleClick = () => {
    import('./moduleA')
      .then(({ moduleA }) => {
        console.log(moduleA)
      })
      .catch(err => {
        console.log(err)
      });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }
} */

export default App;
