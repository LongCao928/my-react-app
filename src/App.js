import logo from './logo.svg';
import './App.css';

import Button from './button/button';
// import { Component } from 'react';

import {
  // createBrowserRouter,
  // RouterProvider,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom'

/* const router =  createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    )
  },
  {
    path: "about",
    element: <div>About</div>,
  }
])*/

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
      {/* react-router-dom */}
      {/* <RouterProvider router={router}></RouterProvider> */}

      {/* Routes nest inside one another. Nested route paths build upon
        parent route paths, and nested route elements render inside
        parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="*" element={<NoMatch />}></Route>
        </Route>
      </Routes>

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

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>
      <hr />
      {/* 在父路由中使用 <Outlet /> 来呈现它们的子路由元素。*/}
      <Outlet />
    </div>
  )
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>404!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
