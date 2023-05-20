
import * as React from 'react';
import {
  Routes,
  Route,
  Outlet,
  Link,
  useSearchParams,
  useParams
} from 'react-router-dom'

import { brands, filterByBrand, SNEAKERS, getSneakerById } from './snkrs'
import { VisuallyHidden } from "@reach/visually-hidden";

/** useSearchParams
 * 用于读取和修改 URL 中当前位置的查询字符串。
 * useSearchParams 钩子返回一个包含两个值的数组：当前位置的搜索参数和一个可以用来更新它们的函数。
 */

/** useParams
 * useParams 钩子返回一个由 <Route path> 匹配的当前URL的动态参数的键/值对组成的对象。
 * 子路由从父路由继承所有参数。
 */

export default function App() {
  return (
    <div className='example-app'>
      <h1>Custom Filter Link Example</h1>

      <p>
        This example demonstrates how to create a "filter link" like one that is
        commonly used to filter a list of products on an e-commerce website. The
        <code>&lt;BrandLink&gt;</code> component is a custom{" "}
        <code>&lt;Link&gt;</code> that knows whether or not it is currently
        "active" by what is in the URL query string.
      </p>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SneakerGrid />}></Route>
          <Route path="/sneakers/:id" element={<SneakerView />}></Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}

function BrandLink({ brand, children, ...props }) {
  let [searchParams] = useSearchParams();
  let isActive = searchParams.get("brand") === brand;
  return (
    <Link
      to={`/?brand=${brand}`}
      {...props}
      style={{
        ...props.style,
        color: isActive ? "red" : "black"
      }}
    >
      {children}
    </Link>
  )
}

function Layout() {
  return (
    <div>
      <nav>
        <h3>Filter by brand</h3>
        <ul>
          <li>
            <Link to="/" >ALL</Link>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <BrandLink brand={brand}>{brand}</BrandLink>
            </li>
          ))}
        </ul>
      </nav>
      <hr />

      <Outlet />
    </div>
  );
}

function SneakerGrid() {
  let [searchParams] = useSearchParams();
  let brand = searchParams.get("brand");
  // React.useMemo 用来做缓存使用，只有当一个依赖项改变的时候才会变化，否则拿缓存的值，不用在每次渲染时重新计算。
  // 使用场景：
  // 1.登陆之后个人信息一般不会改变。把账号密码两个作为依赖项，当他们变了，就更新个人信息，否则拿缓存的值。
  // 2.A页面跳转B页面，并携带一些参数。路由参数当做依赖项，只有依赖项变了，页面数据才会变。
  // 参数1：创建依赖项函数，该函数的返回值就是你想要缓存的数据。
  // 参数2：是个数组，存放着被依赖的项。只有当这个数组里面的变量发生了变化，才会调用参数1的函数。
  const sneakers = React.useMemo(() => {
    if (!brand) return SNEAKERS;
    return filterByBrand(brand)
  }, [brand]);

  return (
    <main>
      <h2>Sneakers</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "12px 24px",
        }}
      >
        {sneakers.map((snkr) => {
          let name = `${snkr.brand} ${snkr.model} ${snkr.colorway}`;
          return (
            <div key={snkr.id} style={{ position: "relative" }}>
              <img
                width={200}
                height={200}
                src={snkr.imageUrl}
                alt={name}
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1 / 1",
                }}
              />
              <Link
                style={{ position: "absolute", inset: 0 }}
                to={`/sneakers/${snkr.id}`}
              >
                {/* VisuallyHidden 为屏幕阅读器提供视觉上隐藏的文本。 */}
                <VisuallyHidden>{name}</VisuallyHidden>
              </Link>
              <div>
                <p>{name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function SneakerView() {
  let { id } = useParams();
  if (!id) {
    return <NoMatch />;
  }
  let snkr = getSneakerById(id);
  if (!snkr) {
    return <NoMatch />;
  }
  let name = `${snkr.brand} ${snkr.model} ${snkr.colorway}`;

  return (
    <div>
      <h2>{name}</h2>
      <img
        width={400}
        height={400}
        style={{
          borderRadius: "8px",
          maxWidth: "100%",
          aspectRatio: "1 / 1",
        }}
        src={snkr.imageUrl}
        alt={name}
      />
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
  );
}

/** git reabse 和 git merge 合并分支区别
 *   $ git rebase -i HEAD~2
 *   git rebase 可以合并本地多条提交(commit)记录。如果commit已经push到远端，则无法合并。
 *  
 * 结论：多人协同开发同一分支使用 git merge、单独开发可使用 git rebase。
 * git merge: (合并时会多一个合并提交记录(merge commit))
 *  好处：
 *   1.可以保证分支合并的安全性，不会修改任何原始提交。
 *   2.操作会生成一个新的合并提交，其中包含了所有分支的更改，这一点在 Git 历史记录上也很明显。
 *  缺点：
 *    1.合并的历史记录较长，记录变得不那么清晰。
 *    2.分支图将在每次合并时变得更加复杂和难以理解。
 * 
 * git rebase:(会将当前分支的所有更改转移到目标分支末端，然后创建一个新的提交并保留原始提交的顺序)
 *  好处：
 *    1.历史记录相对较短，而且相对清晰。
 *    2.合并提交的数量较少，相对整洁。
 *  缺点：
 *    1.原理是撤销提交并重新应用每个提交，可能会导致本地更改进行丢失。
 *    2.多人协同时，可能会破坏他人历史记录。
 * 
 * */