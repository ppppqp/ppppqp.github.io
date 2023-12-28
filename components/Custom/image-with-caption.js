export function load() {
  class ImageWithCaption extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const src = this.getAttribute("src");
      const caption = this.getAttribute("caption");
      const width = this.getAttribute('width') || '15rem';
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
          max-width: ${width};
          margin-left: auto;
          margin-right: auto; 
        }
        .caption {
          font-size: 0.8rem;
          color: #aaa;
        }
        @media (max-width: 400px){
          img {
            max-width: calc(${width}*0.7); 
          }
        }
      </style>
      <div class="container">
        <img src=${src}></img>
        <div class="caption">${caption}</div>
      </div>
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
