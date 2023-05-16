
// import React from "react";

import logo from '../../public/logo512.png';
// import './index.css';

import { ReactComponent as Logo } from '../logo.svg'

function Header() {
  return <img src={logo} className="App-logo" alt="logo" />
}

function App() {
  return (
    <div>
      {Logo}
    </div>
  )

}

export {
  Header as header,
  App
}