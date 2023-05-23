import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useNavigation,
  useRevalidator,
  useFetchers,
  useLoaderData,
  useRouteError,
  Form,
  useFetcher,
  useParams,
  defer,
  Await,
  useAsyncValue,
  useAsyncError
} from "react-router-dom";

import { deleteTodo, addTodo, getTodos } from './todo'

let router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: Home
      },
      {
        path: "todos",
        action: todosAction,  // Form/fetcher/submission 向路由发送提交时，调用
        loader: todosLoader,  // 路由加载器在路由呈现之前被调用，并通过 useLoaderData 为元素提供数据。
        Component: TodosList,
        ErrorBoundary: TodosBoundary, // 路由渲染时抛出异常，这个组件会渲染
        children: [
          {
            path: ":id",
            loader: todoLoader,
            Component: Todo
          }
        ]
      },
      {
        path: "deferred",
        loader: deferredLoader,
        Component: DeferredPage,
      },
    ]
  },
  // {
  //   path: "*",
  //   Component: Errorel,
  //   ErrorBoundary: Errorel
  // }
]);

if (module.hot) {
  module.hot.dispose(() => router.dispose());
}

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<Fallback />}></RouterProvider>
  )
}

function Fallback() {
  return <p>Performing initial data load</p>;
}

export function Layout() {
  // useNavigation() 关于页面导航相关
  let navigation = useNavigation();
  // useRevalidator() 允许出于任何原因重新验证数据
  let revalidator = useRevalidator();
  // useFetchers() 返回一个数组，其中包含所有的flight取回器，但不包含load、submit或Form属性
  let fetchers = useFetchers();
  let fetcherInProgress = fetchers.some((f) =>
    ["loading", "submitting"].includes(f.state)
  )
  return (
    <div className="example-app">
      <h1>Data Router Example</h1>

      <p>
        This example demonstrates some of the core features of React Router
        including nested &lt;Route&gt;s, &lt;Outlet&gt;s, &lt;Link&gt;s, and
        using a "*" route (aka "splat route") to render a "not found" page when
        someone visits an unrecognized URL.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <li>
            <Link to="/deferred">Deferred</Link>
          </li>
          <li>
            <Link to="/404">404 Link</Link>
          </li>
          <li>
            <button onClick={() => revalidator.revalidate()}>Revalidate Data</button>
          </li>
        </ul>
      </nav>

      <div style={{ position: "fixed", top: 0, right: 0 }}>
        {navigation.state !== "idle" && <p>Navigation in progress...</p>}
        {revalidator.state !== "idle" && <p>Revalidation in progress...</p>}
        {fetcherInProgress && <p>Fetcher in progress...</p>}
      </div>

      <p>
        Click on over to <Link to="/todos">/todos</Link> and check out these
        data loading APIs!
      </p>
      <p>
        Or, checkout <Link to="/deferred">/deferred</Link> to see how to
        separate critical and lazily loaded data in your loaders.
      </p>
      <p>
        We've introduced some fake async-aspects of routing here, so Keep an eye
        on the top-right hand corner to see when we're actively navigating.
      </p>

      <hr />
      <Outlet />
    </div>
  )
}

export function sleep(n = 500) {
  return new Promise((r) => setTimeout(r, n))
}

export async function homeLoader() {
  await sleep();
  return {
    date: new Date().toISOString()
  }
}

export function Home() {
  let data = useLoaderData();
  return (
    <>
      <h2>Home</h2>
      <p>Date from loader: {data.date}</p>
    </>
  );
}

// Todos

export async function todosAction({ request }) {
  await sleep();
  let formData = await request.formData();

  // Deletion via fetcher
  if (formData.get("action") === "delete") {
    let id = formData.get("todoId");
    if (typeof id === "string") {
      deleteTodo(id);
      return { ok: true };
    }
  }

  let todo = formData.get("todo");
  if (typeof todo === "string") {
    addTodo(todo);
  };

  return new Response(null, {
    status: 302,
    headers: { Location: "/todos" },
  });
}

export async function todosLoader() {
  await sleep();
  return getTodos();
}

export function TodosList() {
  let todos = useLoaderData();
  let navigation = useNavigation();
  let formRef = React.useRef(null);

  let [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    if (navigation.formData?.get("action") === "add") {
      setIsAdding(true);
    } else if (navigation.state === "idle") {
      setIsAdding(false);
      formRef.current?.reset();
    }
  }, [navigation]);

  return (
    <>
      <h2>Todos</h2>
      <p>
        This todo app uses a &lt;Form&gt; to submit new todos and a
        &lt;fetcher.form&gt; to delete todos. Click on a todo item to navigate
        to the /todos/:id route.
      </p>
      <ul>
        <li>
          <Link to="/todos/junk">
            Click this link to force an error in the loader
          </Link>
        </li>
        {Object.entries(todos).map(([id, todo]) => (
          <li key={id}>
            <TodoItem id={id} todo={todo} />
          </li>
        ))}
      </ul>
      <Form method="post" ref={formRef}>
        <input type="hidden" name="action" value="add" />
        <input name="todo"></input>
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add"}
        </button>
      </Form>
      <Outlet />
    </>
  );
}

export function TodosBoundary() {
  let error = useRouteError();
  return (
    <>
      <h2>Error 💥</h2>
      <p>{error.message}</p>
    </>
  );
}

export function TodoItem({ id, todo }) {
  let fetcher = useFetcher();

  let isDeleting = fetcher.formData != null;
  return (
    <>
      <Link to={`/todos/${id}`}>{todo}</Link>
      &nbsp;
      <fetcher.Form method="post" style={{ display: "inline" }}>
        <input type="hidden" name="action" value="delete" />
        <button type="submit" name="todoId" value={id} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </fetcher.Form>
    </>
  );
}


// Todo
export async function todoLoader({
  params,
}) {
  await sleep();
  let todos = getTodos();
  if (!params.id) {
    throw new Error("Expected params.id");
  }
  let todo = todos[params.id];
  if (!todo) {
    throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
  }
  return todo;
}

export function Todo() {
  let params = useParams();
  let todo = useLoaderData();
  return (
    <>
      <h2>Nested Todo Route:</h2>
      <p>id: {params.id}</p>
      <p>todo: {todo}</p>
    </>
  );
}


const rand = () => Math.round(Math.random() * 100);
const resolve = (d, ms) =>
  new Promise((r) => setTimeout(() => r(`${d} - ${rand()}`), ms));
const reject = (d, ms) =>
  new Promise((_, r) =>
    setTimeout(() => {
      if (d instanceof Error) {
        d.message += ` - ${rand()}`;
      } else {
        d += ` - ${rand()}`;
      }
      r(d);
    }, ms)
  );


export async function deferredLoader() {
  return defer({
    critical1: await resolve("Critical 1", 250),
    critical2: await resolve("Critical 2", 500),
    lazyResolved: Promise.resolve("Lazy Data immediately resolved - " + rand()),
    lazy1: resolve("Lazy 1", 1000),
    lazy2: resolve("Lazy 2", 1500),
    lazy3: resolve("Lazy 3", 2000),
    lazyError: reject(new Error("Kaboom!"), 2500),
  });
}


export function DeferredPage() {
  let data = useLoaderData();
  return (
    <div>
      {/* Critical data renders immediately */}
      <p>{data.critical1}</p>
      <p>{data.critical2}</p>

      {/* Pre-resolved deferred data never triggers the fallback */}
      <React.Suspense fallback={<p>should not see me!</p>}>
        <Await resolve={data.lazyResolved}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Deferred data can be rendered using a component + the useAsyncValue() hook */}
      <React.Suspense fallback={<p>loading 1...</p>}>
        <Await resolve={data.lazy1}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 2...</p>}>
        <Await resolve={data.lazy2}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Or you can bypass the hook and use a render function */}
      <React.Suspense fallback={<p>loading 3...</p>}>
        <Await resolve={data.lazy3}>{(data) => <p>{data}</p>}</Await>
      </React.Suspense>

      {/* Deferred rejections render using the useAsyncError hook */}
      <React.Suspense fallback={<p>loading (error)...</p>}>
        <Await resolve={data.lazyError} errorElement={<RenderAwaitedError />}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>
    </div>
  );
}

function RenderAwaitedData() {
  let data = useAsyncValue();
  return <p>{data}</p>;
}

function RenderAwaitedError() {
  let error = useAsyncError();
  return (
    <p style={{ color: "red" }}>
      Error (errorElement)!
      <br />
      {error.message} {error.stack}
    </p>
  );
}

/* function Errorel() {
  return (
    <div>404...</div>
  )
} */