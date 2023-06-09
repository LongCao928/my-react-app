
// Redux Toolkit 是官方推荐的高效Redux开发工具集。
// 它是编写 Redux 逻辑的标准方式，官方强烈建议使用。
// 它包括几个实用函数来简化最常见的Redux用例，包括store设置、定义reducers、不可变的更新逻辑，
// 甚至可以一次性创建整个状态“切片”，而无需手动编写任何action生成器或action类型。
// 它还包含了最广泛使用的Redux插件，比如用于异步逻辑的Redux Thunk和用于编写选择器函数的Reselect，
// 以便您可以立即使用它们。
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './features/counter/counterSlice';

// 使用 configureStore 创建一个 store
export default configureStore({
  // configureStore 函数接受一个 reducer 函数作为命名参数
  reducer: {
    counter: counterReducer
  },
});

// Reduce Essentials
// Reduce 是一个用于管理和更新应用状态的模式和库，使用称为 actions 的事件。
// 它是需要在整个应用程序中使用的状态的集中存储，其规则确保状态只能以可预测的方式更新。

// Reduce核心思想：在应用程序中使用一个集中的位置来包含全局状态，并且在更新该状态时遵循特定的模式以使代码可预测。

// stage management(状态管理)

/** 术语
 * Actions: 将操作视为描述应用程序中发生的事情的事件。
 * state: 状态
 * store: 存储当前 Reduce 应用程序的状态。
 * getState: 获取当前状态的值。
 * dispathch: 更新状态的唯一方法是调用 store.dispatch() 并传入一个 action 对象，store将运行它的 reducer 函数并将新的state值保存在里面。
*/

// Reduce 使用 "单向数据流" 应用程序结构。
// state 描述了应用在某一时刻的状态， UI 会根据该状态进行渲染。
// 当应用程序中发生了一些事情：UI 分发一个 action， store 运行 reducer，状态会根据发生的情况进行更新，
// store 通知 UI 状态已经改变， UI 会根据新的状态重新渲染。




