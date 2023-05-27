
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './counterSlice';

// 在 React 组件中使用 react-redux 的 useSelector、useDispatch 钩子
// useSelector 钩子从数据存储中读取数据
// useDispatch 钩子获取dispatch函数，并根据需要分发操作
export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div >
      <style>
        {`
          button {
            padding: 5px 10px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
          }
          button:hover {
            color: #fff;
            background: lightgreen;
          }
          span {
            display: inline-block;
            margin: 0 10px;
          }
        `}
      </style>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}