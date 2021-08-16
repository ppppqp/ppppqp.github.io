---

title:  "React Refs"
date:   2021-03-12 20:29:23 +0800
categories: Front-end Note React
toc: true
---



# React Ref
[React API](https://reactjs.org/docs/refs-and-the-dom.html)


## Overview:
*Refs provide a way to access DOM nodes or React elements created in the render method.*
>In the typical React dataflow, props are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

When to use:
* Managing focus, text selection, or media playback.
* Triggering imperative animations
* Integrating with third-party DOM libraries

## Createing Refs
```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    //commonly assigned to an instance property when a component is constructed.
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

## Accessing Refs
```js
//in render
const node = this.myRef.current;
// this.myRef.current provide a reference for the element.
```

Value of ref:
* When the ref attribute is used on an **HTML element**, the ref created in the constructor with React.createRef() receives the **underlying DOM element** as its current property.
* When the ref attribute is used on a **custom class component**, the ref object receives the **mounted instance** of the component as its current.


*You may not use the ref attribute on function components because they don’t have instances.*

####Examples
Adding to DOM element:
```js
// click on the button and the text input gets focus
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```
React will assign the current property with the DOM element when the component mounts, and assign it back to null when it unmounts. **ref updates happen before componentDidMount or componentDidUpdate lifecycle methods**.

Adding to Class Component

```js
// after being mounted, immediately call its focusTextInput method
// ONLY WORKS if CustomTextInput is declared as class
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

## Callback Refs
```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

Usage:
```js
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  // in the child node, declare the ref as the callback function
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
        // in the parent node, pass the callback function as the props

      />
    );
  }
}
```
In this way, `this.inputElement` in parent node will be set to the DOM node corresponding ot the `<input>` element in the child node

# Forwarding Refs

Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child.

React.forwardRef accepts a render function. 
```js
// FancyButton opbtains the ref passed to it
// and forward it to the button it renders.
const FancyButton = React.forwardRef((props, ref) => (
  // the ref params only exists with fowardRef call
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```


```js
//better example
import React, { Component, createRef, forwardRef } from 'react';

// to use forwardRef, the child has to be declared in this form
const FocusInput = forwardRef((props, ref) => (
    <input type="text" ref={ref} />
));

class ForwardRef extends Component {
    constructor(props) {
        super(props);
        this.ref = createRef();
        //although this ref is passed as props to FocusInput
        //it is forwarded to its child so it is binded to the 
        // grandchild (input component)
    }

    componentDidMount() {
        const { current } = this.ref;
        current.focus();
    }

    render() {
        return (
            <div>
                <p>forward ref</p>
                <FocusInput ref={this.ref} />
            </div>
        );
    }
}
export default ForwardRef;
```