export function load() {
  class ImageWithCaption extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const src = this.getAttribute("src");
      const caption = this.getAttribute("caption");

      const template = document.createElement("template");
      template.innerHTML = `
      <style>
        .container {
          display: flex;
          flex-direction: column; 
          justify-content: center;
          align-items: center;      
        }
        img {
          width:15rem; 
          margin-left: auto;
          margin-right: auto; 
        }
        .caption {
          font-size: 0.8rem;
          color: #aaa;
        }
      </style>
      <div class="container">
        <img src=${src}></img>
        <div class="caption">${caption}</div>
      <div>
    `;
      this.shadow.append(template.content.cloneNode(true));
    }
    // connectedCallback(){
    //   this.shadow.innerHTML="<div>hello</div>"
    // }
  }
  if(!customElements.get("image-with-caption")){
    customElements.define("image-with-caption", ImageWithCaption);
  }
}
