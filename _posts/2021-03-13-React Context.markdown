---
layout: post
title:  "React Context"
date:   2021-03-13 9:29:23 +0800
categories: Front-end Note
---

<!-- TOC -->

- [Context](#context)
  - [Usage Senario](#usage-senario)
  - [API](#api)
    - [`React.createContext`](#reactcreatecontext)
    - [`Context.Provider`](#contextprovider)
    - [`Class.contextType`](#classcontexttype)
    - [`Context.Consumer`](#contextconsumer)
  - [Using Context](#using-context)
  - [Caveats](#caveats)

<!-- /TOC -->


# Context
[React Docs](https://reactjs.org/docs/context.html)
*Context provides a way to pass data through the component tree without having to pass props down manually at every level.*

## Usage Senario
Context is designed to share data that can be considered **“global” for a tree of React components**, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a “theme” prop in order to style the Button component.
For example, we have a "theme" property that should go to every component.

```jsx
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the ***closest theme*** Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

However, if you just want to prevent from passing down a particular props to some deep component, you don't have to use context.

You can use props to pass down the component as a whole, so the intermediate layers don't need to worry about the props of this component: they just need to pass it down.
```jsx
// pass down the  "userLink" component as props

function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
```


## API
### `React.createContext`
```jsx
const MyContext = React.createContext(defaultValue);
```
Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the **closest matching Provider above it in the tree**. If no provider is found, default value will be used.

### `Context.Provider`
```jsx
<MyContext.Provider value={/* some value */}>
```
Provide the context for its children. Can be overrided by nesting.


### `Class.contextType`
```jsx
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;
// myContext is a context object
```

### `Context.Consumer`
A React component that subscribes to context changes. Using this component lets you subscribe to a context within a function component.


```jsx
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

It is good to consume multiple theme:
```jsx
// Theme context, default to light theme
const ThemeContext = React.createContext('light');

// Signed-in user context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // App component that provides initial context values
    //TWO providers
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// A component may consume multiple contexts
function Content() {
  // TWO consumers
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

```

## Using Context
```jsx
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const ThemeContext = React.createContext(
  themes.dark // default value
);
```

To use a context:
1. Do create context
2. Use context.provider to wrap around the related consumer components
3. In the consumer components, use `Classname.contextType` to bind a context
4. use `this.context` to get the context


## Caveats
```jsx
//wrong, this will cause the provider to re-render
// all consumers everytime provider re-render
//bcause the value is always a new object
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}

//Correct: lift the value into the parent's state.
// It now can recognize that they are the same
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```