
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './counterSlice';

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