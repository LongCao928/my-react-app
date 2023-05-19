
// import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData
} from "react-router-dom";

/** createBrowserRouter
 * 所有 React Router Web 项目推荐的路由器。它使用 DOM History API 来更新 URL 和管理历史堆栈。
 * 它支持 v6.4 数据api，如 loaders，actions，fetchers等
 */

/** RouterProvider
 * 所有的数据路由器对象都被传递给这个组件来渲染你的应用，并启用其它的数据api。
 *    fallbackElement: 如果你没有服务器渲染你的应用，createBrowserRouter会在它挂载时启动所有匹配的路由加载器。在此期间，你可以提供一个fallbackElement，向用户提示应用程序正在工作。让静态托管TTFB生效!
 */

/** useLoaderData
 * 提供路由(loader)加载器返回的值。
 * 在路由操作被调用后，数据将自动重新验证并从加载器返回最新的结果。
 * 请注意，useLoaderData 不会初始化获取。
 * 它只是读取 React 路由器内部管理的 fetch 的结果，所以当它由于路由之外的原因重新渲染时，你不需要担心它重新获取。
 * 你可以在任何组件或任何自定义钩子中使用此钩子，而不仅仅是在路由元素中。它将从上下文上最近的路由返回数据。
 * 要从页面中任何活动路由获取数据，请参阅 useRouteLoaderData。
 */

let router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData()
      return <h1>{data.message}</h1>
    }
  }
], {
  // 应用程序的basename，用于不能部署到域的根目录，而是一个子目录的情况。
  // basename: "/app",
  // 一组可选的未来标志来启用这个路由器。建议尽早选择新发布的未来标志，以便最终迁移到v7。
  future: {
    v7_normalizeFormMethod: true,
  }
})

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>loading...</p>}></RouterProvider>;
}

if (module.hot) {
  console.log('hot')
  module.hot.dispose(() => router.dispose())
}