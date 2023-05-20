import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './react-router-example/basic-data-router/App';
// import App from './App';
// import App from './react-router-example/auth/App';
import App from './react-router-example/custom-filter-link/App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode 严格模式。用来检查项目中潜在问题的工具。
  // 与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。
  <React.StrictMode>
    {/* Routes 创建的Route，使用 BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>

    {/* createBrowserRouter 创建Router，使用 RouterProvider */}
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// <react-scripts> 生成项目的开发依赖包

// 打包并运行项目
// npm run build 
// npm install -g serve
// serve -s build

const $ = window.$
console.log($)

// 添加 ts
// npm install --save typescript @types/node @types/react @types/react-dom @types/jest

// environment variables
console.log(process.env.NODE_ENV)
console.log(process.env.PUBLIC_URL)

// REACT_APP_ 开头定义环境变量
console.log(process.env.REACT_APP_NAME)

// 左侧文件优先级高于右侧
// npm start: .env.development.local, .env.local, .env.development, .env
// npm run build: .env.production.local, .env.local, .env.production, .env
// npm test: .env.test.local, .env.test, .env (note .env.local is missing)

