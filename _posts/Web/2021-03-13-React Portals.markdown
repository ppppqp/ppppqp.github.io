---

title:  "React Portals"
date:   2021-03-13 10:29:23 +0800
categories: Front-end Note React
toc: true
---


# Portals
*Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.*

# Usage
Normally, when you return an element from a component’s render method, it’s mounted into the DOM as a child of the nearest parent node.
However, sometimes it’s useful to insert a child into a different location in the DOM:


```jsx
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```


A typical use case for portals is when a parent component has an overflow: hidden or z-index style, but you need the child to visually “break out” of its container. For example, dialogs, hovercards, and tooltips.


You can think of Portal as a pathway that connects the parent element and the DOM element. The children can walk to the DOM element rather than stay under the parent element.
```jsx
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
  }
  
  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el,
    );
  }
}

```

Even though a portal can be anywhere in the DOM tree, it **behaves like a normal React child in every other way.** Features like context work exactly the same regardless of whether the child is a portal, as the portal still **exists in the React tree regardless of position in the DOM tree**.

This includes event bubbling. An event fired from inside a portal will propagate to ancestors in the containing React tree, even if those elements are not ancestors in the DOM tree.