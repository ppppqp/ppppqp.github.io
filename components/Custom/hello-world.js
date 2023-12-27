import { render } from "react-dom";
// class HelloWorldComponent extends HTMLElement {
//   constructor() {
//     super();
//   }
  
//   connectedCallback() {
//     this.innerHTML = `<div>Hello world!</div>`
//   }

// }
// customElements.define("hello-world", HelloWorldComponent);
export function load(){
  const domNode = document.getElementById('hello-world')
  if(domNode){
    render(<div>Hello World</div>, domNode);
  }
}

// const root = createRoot(domNode);
// root.render(<div>Hello World</div>);