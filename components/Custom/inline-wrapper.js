export function load() {
  class InlineWrapper extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const template = document.createElement("template");
      template.innerHTML = `
      <style>
        .container {
          display: flex;
          flex-direction: row;
          align-items: start;
          justify-content: space-between;
        }
      </style>
      <div class="container">
        <slot></slot>
      <div>
    `;
      this.shadow.append(template.content.cloneNode(true));
    }
  }
  if(!customElements.get("inline-wrapper")){
    customElements.define("inline-wrapper", InlineWrapper);
  }
}
