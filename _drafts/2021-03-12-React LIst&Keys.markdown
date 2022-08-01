---

title:  "React List&Keys"
date:   2021-03-12 20:29:23 +0800
categories: Front-end Note React
toc: true
---



# React List&Keys
[React API](https://reactjs.org/docs/lists-and-keys.html)


## Rendering Multiple Components:
```js
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
);
```

Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity.

When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort.
```js
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

#### Reason for Keys
By default, when recursing on the children of a DOM node, React just iterates over both lists of children at the same time and generates a mutation whenever there’s a difference.

For example, when rendering this component
```js
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```
React will match `Duke` with `Connecticut` and mutate every child.

In order to solve this issue, React supports a key attribute. When children have keys, React uses the key to match children in the original tree with children in the subsequent tree. For example, adding a key to our inefficient example above can make the tree conversion efficient.

As a last resort, you can pass an item’s index in the array as a key. This can work well if the items are never reordered, but reorders will be slow.