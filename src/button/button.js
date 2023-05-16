
import React, { Component } from 'react';
import './button.css';
// import './button.scss';

// 该项目支持同时使用命名规则为 [name].module.css 的CSS 模块与常规样式表。
// CSS 模块通过自动创建格式为 [filename]\_[classname]\_\_[hash] 的唯一类名来对 CSS 进行范围界定。
import styles from './button.module.css';
import './another-stylesheet.css';

class Button extends Component {
  handleClick() {
    console.log('点击了按钮')
  }
  render() {
    return <div className='Button'>
      <button onClick={this.handleClick}>按钮</button>
      <button className={styles.error}>Error Button</button>
    </div>
  }
}

console.log(React)

export default Button