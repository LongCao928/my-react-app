import {
  Routes,
  Route,
  Outlet,
  useResolvedPath,
  useMatch,
  Link
} from 'react-router-dom';

/** useResolvedPath
 * 将给定 to 值中的位置的路径名与当前位置的路径名进行解析。
 * useResolvedPath() 在内部使用 resolvePath 来解析路径名。
 * 如果 to 包含一个路径名，则根据当前路由的路径名解析。否则，根据当前 URL(location.pathname) 进行解析。
 */

/** useMatch
 * 返回给定路径上的路由相对于当前位置的匹配数据。
 * useMatch() 内部使用 matchPath 函数来匹配相对于当前位置的路由路径。
 * matchPath 根据 URL 路径名匹配路由路径模式，并返回匹配的信息。
 */

export default function App() {
  return (
    <div className='example-app'>
      <h1>Custom Link Example</h1>
      <p>
        This example demonstrates how to create a custom{" "}
        <code>&lt;Link&gt;</code> component that knows whether or not it is
        "active" using the low-level <code>useResolvedPath()</code> and{" "}
        <code>useMatch()</code> hooks.
      </p>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  return (
    <div>
      <Link
        style={{ textDecoration: match ? "underline" : "none" }}
        to={to}
        {...props}
      >
        {children}
      </Link>
      {match && " (active)"}
    </div>
  )
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <CustomLink to="/">Home</CustomLink>
          </li>
          <li>
            <CustomLink to="/about">About</CustomLink>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h1>Nothing to see here!</h1>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}