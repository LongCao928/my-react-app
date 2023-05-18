
import * as React from 'react'
import { fakeAuthProvider } from './auth'
import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate, // 元素在渲染时会改变当前位置，它是useNavigate的一个组件包装器，并接受与props相同的参数。
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
 * path: 用来匹配URL。一个路径以 : 开头，那么他就是一个动态段。
 *    <Route path="/c/:categoryId/p/:productId" />; params.categoryId; params.productId;
 *    /*: 匹配/之后的所有字符。
 *    index: 默认子路由
 * 
 * loader: 路由加载器在路由渲染之前被调用，并通过 useLoaderData 为元素提供数据。
 * action:  Form, fetcher, or submission 将提交发送到路由时，路由操作会被调用。
 * element/Component: 当路由匹配URL时渲染的React元素/组件。
 * errorElement/ErrorBoundary: 当路由在渲染时抛出异常，在loader或action中，此React元素/组件将渲染而不是正常的元素/组件。
 * lazy: 为了让你的应用包更小并支持路由的代码分割，每个路由都可以提供一个异步函数来解决路由定义中不匹配的部分(loader、action、Component/element、ErrorBoundary/ errorrelement等)。
 * 
 * 使用 createBrowserRouter(jsx: createRoutesFromElements) 声明路由。
 */

/** Outlet
 * <Outlet> 应该在父路由元素中用来渲染子路由元素。允许在渲染子路由时显示嵌套UI。
 * 如果父路由完全匹配，它将渲染子索引路由，如果没有索引路由，则什么都不渲染。
 */

/** Link
 * <Link> 是一个元素，它允许用户通过单击或轻击跳转到另一个页面。
 * 在 react-router-dom 中，<Link> 渲染了一个可访问的<a>元素，该元素具有一个真实的href，指向它所链接的资源。
 * 
 * relative: 默认情况下，链接是相对于路由层次结构的，所以..会上升一层。
 *    有时，你可能会发现匹配的URL模式没有嵌套的意义，这时你会倾向于使用相对路径路由。可以选择使用relative实现这种行为。
 * 
 * preventScrollReset: 允许你在点击链接时防止滚动位置重置到窗口顶部。
 * replace: 替换历史堆栈中的当前条目，可以使用replace属性。替换默认的 history.pushState。
 * state: 可以用来为存储在 history 状态中的新位置设置有状态的值。这个值随后可以通过 useLocation() 访问。
 * reloadDocument: 可以跳过客户端路由，让浏览器正常处理过渡(就像它是一个<a href>一样)。
 * 
 */

/** useNavigate
 * 钩子返回一个函数，允许你以编程方式导航。
 * 传递一个 To value(与<Link To >类型相同)，并带有可选的second {replace, state}参数。或者
 * 传递你想要进入历史堆栈的delta。例如，使用navigate(-1)等同于点击后退按钮。
 * 
 * 使用 replace:true，导航将替换历史堆栈中的当前条目，而不是添加一个新的条目。
 */

/** useLocation
 * 钩子返回当前的 location 对象。如果你想在当前位置改变时执行一些副作用，这可以很有用。
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