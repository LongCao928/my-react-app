
import * as React from 'react';
import * as JSURL from "jsurl";

import { Routes, Route, Link, useSearchParams } from "react-router-dom";

export default function App() {
  return (
    <div className='example-app'>
      <h1>Custom Query Parsing Example</h1>
      <p>
        这个例子演示了如何在 URL 中存储复杂的数据结构查询参数。
      </p>
      <p>
        每当下面表单中的字段发生更改时，URL就会使用表单值的序列化版本。为了看到它的效果，操作表单中的一些字段。
        然后，复制地址中的 URL 栏并将其粘贴到浏览器中的新选项卡中，以便在和你离开的时候一模一样!
      </p>

      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  )
}

function useQueryParam(key) {
  let [searchParams, setSearchParams] = useSearchParams();
  let paramValue = searchParams.get(key);
  let value = React.useMemo(() => JSURL.parse(paramValue), [paramValue]);
  let setValue = React.useCallback((newValue, options) => {
    // URLSearchParams API: 用于处理 URL 之中的查询字符串，即 ? 之后的部分。
    let newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(key, JSURL.stringify(newValue)); // set 设置指定参数
    setSearchParams(newSearchParams, options);
  }, [key, searchParams, setSearchParams]);

  return [value, setValue]
}

function Home() {
  let [pizza, setPizza] = useQueryParam("pizza");
  if (!pizza) {
    pizza = { toppings: [], crust: "regular", extraSauce: false }
  }

  function handleChange(event) {
    let form = event.currentTarget;
    let formData = new FormData(form);

    let pizza = {
      toppings: formData.getAll("toppings"),
      crust: formData.get("crust"),
      extraSauce: formData.get("extraSauce") === "on",
    };

    setPizza(pizza, { replace: true });
  }
  return (
    <div>
      <form onChange={handleChange}>
        <p>What would you like on your pizza?</p>
        <p>
          <label>
            <input
              defaultChecked={pizza.toppings.includes("pepperoni")}
              type="checkbox"
              name="toppings"
              value="pepperoni"
            />{" "}
            Pepperoni
          </label>
          <br />
          <label>
            <input
              defaultChecked={pizza.toppings.includes("bell-peppers")}
              type="checkbox"
              name="toppings"
              value="bell-peppers"
            />{" "}
            Bell Peppers
          </label>
          <br />
          <label>
            <input
              defaultChecked={pizza.toppings.includes("olives")}
              type="checkbox"
              name="toppings"
              value="olives"
            />{" "}
            Olives
          </label>
          <br />
          <label>
            <input
              defaultChecked={pizza.crust === "regular"}
              type="radio"
              name="crust"
              value="regular"
            />{" "}
            Regular Crust
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="crust"
              value="thin"
              defaultChecked={pizza.crust === "thin"}
            />{" "}
            Thin Crust
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="crust"
              value="deep-dish"
              defaultChecked={pizza.crust === "deep-dish"}
            />{" "}
            Deep Dish
          </label>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              name="extraSauce"
              defaultChecked={pizza.extraSauce}
            />{" "}
            Extra Sauce
          </label>
        </p>
      </form>
      <hr />

      <p>The current form values are:</p>

      <pre>{JSON.stringify(pizza || {}, null, 2)}</pre>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}