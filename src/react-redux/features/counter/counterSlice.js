import { createSlice } from "@reduxjs/toolkit";

// 使用 createSlice 创建一个 Redux  "slice" reducer
export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action 生成器为每个 case reducer 函数生成
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer