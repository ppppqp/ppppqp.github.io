export function load() {
  class Swiper extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const width = this.getAttribute('width') || '15rem';
      this.currentIndex = 0;
      const template = document.createElement("template");
      template.innerHTML = `
      <style>
      .swiper-container {
        width: 300px;
        overflow: hidden;
        position: relative;
      }
    
      .swiper-wrapper {
        display: flex;
        transition: transform 0.3s ease;
      }
    
      .swiper-slide {
        flex: 0 0 300px;
        height: 200px;
        margin-right: 20px;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
      }
    
      .swiper-control {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        cursor: pointer;
      }
    
      .swiper-control.left {
        left: 0;
      }
    
      .swiper-control.right {
        right: 0;
      }
      </style>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
        </div>
        <div class="swiper-control left">&lt;</div>
        <div class="swiper-control right">&gt;</div>
      </div>
    `;
      this.shadow.append(template.content.cloneNode(true));
    }
    connectedCallback(){
      this.leftControl = this.shadowRoot.querySelector('.swiper-control.left');
      this.rightControl = this.shadowRoot.querySelector('.swiper-control.right');
      this.swiperWrapper = this.shadowRoot.querySelector('.swiper-wrapper');
      this.slides = this.shadowRoot.querySelectorAll('.swiper-slide');

      console.log(this.leftControl)
      this.leftControl.addEventListener('click', () => {

        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.moveSlider();
        }
      });

      this.rightControl.addEventListener('click', () => {
        console.log('click', this.slides.length)
        if (this.currentIndex < this.slides.length - 1) {
          this.currentIndex++;
          console.log(this.currentIndex)
          this.moveSlider();
        }
      });
    }

    moveSlider() {
      console.log('click')
      this.swiperWrapper.style.transform = `translateX(-${this.currentIndex * 320}px)`; // 320 = slide width (300) + margin (20)
    }
  }
  if(!customElements.get("swiper-container")){
    customElements.define("swiper-container", Swiper);
  }
}
