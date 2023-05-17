
import * as React from 'react'
import { fakeAuthProvider } from './auth'
import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom'

/** Routes
 * Routes 在应用的任何地方渲染，<Routes> 都会匹配当前位置的一组子路由。
 * 每当位置改变时，<Routes> 会查找所有子路由以找到最佳匹配并渲染 UI 的分支。
 * <Route> 元素可以嵌套表示嵌套的 UI，也对应嵌套的 URL 路径。
 * 父路由通过渲染一个 <Outlet /> 来渲染子路由。
 * 
 *  提示：使用 createBrowserRouter 数据路由器时，那么很少使用这个组件。<Routes> 不能利用 RouterProvider 提供的 Data APIs。
 * */

/** Route
 * <Route> 路由是 React 路由应用程序中最重要的部分，它们将 URL 段与组件、数据加载和数据突变耦合起来。
 * 通过路由嵌套，复杂的应用布局和数据依赖关系变得简单和具有声明。
 * 
 * 使用 createBrowserRouter(jsx: createRoutesFromElements) 声明路由。
 */

export default function App() {
  return (
    <AuthProvider >
      <div className="example-app">
        <h1>Auth Example</h1>
        <p>
          这个示例演示了一个简单的登录流程，其中包含三个页面:一个公共页面、一个受保护页面和一个登录页面。为了查看受保护的页面，您必须先登录。非常标准的东西。
        </p>

        <p>
          首先，访问公共页面。然后，访问受保护页面。您还没有登录，所以您被重定向到登录页面。登录后，您将被重定向回受保护的页面。
        </p>

        <p>
          请注意每次URL都会更改。如果此时单击后退按钮，您希望返回登录页面吗?不!你已经登录了。尝试一下，你会看到自己回到了登录前访问过的页面，即公共页面。
        </p>

        {/* 路由开始 */}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PublicPage />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="protected"
              element={<RequireAuth>
                <ProtectedPage></ProtectedPage>
              </RequireAuth>}
            ></Route>
          </Route>
        </Routes>
      </div>

    </AuthProvider>
  )
}

let AuthContext = React.createContext(null)

function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null)
  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser)
      callback()
    })
  }

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null)
      callback()
    })
  }

  let value = { user, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Layout() {
  return (
    <div>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  )
}

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p>您没有登录。</p>;
  }

  return (
    <p>
      欢迎 {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        退出
      </button>
    </p>
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");

    auth.signin(username, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <p>必须登录才能查看 {from} 页面 </p>

      <form onSubmit={handleSubmit}>
        <label>
          姓名: <input name="username" type="text" />
        </label>{" "}
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}