---
layout: post
title:  "React Code Splitting"
date:   2021-03-13 8:29:23 +0800
categories: Front-end Note
---

<!-- TOC -->

- [Code-Splitting](#code-splitting)
  - [Usage Senario](#usage-senario)
  - [Dynamic Import Syntax](#dynamic-import-syntax)
  - [React.lazy](#reactlazy)

<!-- /TOC -->
# Code-Splitting

## Usage Senario
Most React apps will have their files “bundled” using tools like Webpack, Rollup or Browserify. Bundling is the process of following imported files and merging them into a single file: a “bundle”. This bundle can then be included on a webpage to load an entire app at once.

Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries.

To avoid winding up with a large bundle, it’s good to get ahead of the problem and start “splitting” your bundle. **Code-Splitting is a feature** supported by bundlers like Webpack, Rollup and Browserify (via factor-bundle) which **can create multiple bundles that can be dynamically loaded at runtime.**

**Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app.** While you haven’t reduced the overall amount of code in your app, you’ve avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.


## Dynamic Import Syntax
```jsx
// import a library
// if you want to import math to call math function
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```


## React.lazy
```js
// import a component
//before
import OtherComponent from './OtherComponent';

//after
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```


```jsx
// using suspense to wait for the component to load
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}

```


```jsx
// code splitting based on react router
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

React.lazy currently only supports default exports. 
```js
//Many Componnent.js
// without default export
export const MyComponent = /* ... */;

//My Component.js
export { MyComponent as default } from "./ManyComponents.js";

//App.js
const MyComponent = lazy(() => import("./MyComponent.js"));
```