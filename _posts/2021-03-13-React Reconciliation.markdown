---

title:  "React Reconciliation"
date:   2021-03-13 12:29:23 +0800
categories: Front-end Note React
toc: true
---


# Reconciliation
## Motivation
When you use React, at a single point in time you can think of the render() function as creating a tree of React elements. On the next state or props update, that render() function will return a different tree of React elements. React then needs to figure out how to efficiently update the UI to match the most recent tree.

There are some generic solutions to this algorithmic problem of generating the minimum number of operations to transform one tree into another. However, the state of the art algorithms have a complexity in the order of **O($n^{3}$) where n is the number of elements in the tree**.

If we used this in React, displaying 1000 elements would require in the order of one billion comparisons. This is far too expensive. Instead, **React implements a heuristic O(n) algorithm** based on two assumptions:

1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a key prop.


## Diffig Algorithm
When diffing two trees, React first compares the ***two root elements***. The behavior is different depending on the types of the root elements.


### Elements Of Different Types
Whenever the root elements have different types, React will **tear down the old tree and build the new tree from scratch**. 
1. DOM nodes destroyed
2. Component instance receive `componentWillUnmount`
3. new DOM nodes inserted
4. Component instances receive `componentDidMount`
5. Any components below the root will also get unmounted and have their state destroyed.


### DOM Elements Of The Same Type

When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes. For example:

```jsx
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

By comparing these two elements, React knows to only modify the `className` on the underlying DOM node.

```jsx
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

When converting between these two elements, React knows to only modify the color style, not the fontWeight.